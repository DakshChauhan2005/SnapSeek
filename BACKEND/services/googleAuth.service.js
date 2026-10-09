import crypto from "crypto";
import userModel from "../model/user.model.js";

/**
 * Builds a username that satisfies the register validator
 * (3-30 chars, letters / numbers / underscore / space) and is not taken yet.
 */
async function generateUniqueUsername(displayName, email) {
    const source = displayName || email.split("@")[0] || "user";
    let base = source
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 22);
    if (base.length < 3) base = "user";

    let candidate = base;
    for (let i = 0; i < 6; i++) {
        const taken = await userModel.exists({ username: candidate });
        if (!taken) return candidate;
        candidate = `${base}_${crypto.randomInt(1000, 10000)}`;
    }
    return `user_${crypto.randomBytes(4).toString("hex")}`;
}

/**
 * Resolves a Google profile to a SnapSeek user, creating or linking as needed.
 *
 * 1. Known googleId            -> that user.
 * 2. Same (Google-verified) email as an existing account -> link Google to it.
 * 3. Otherwise                 -> create a new, already-verified user.
 *
 * Throws an Error with `.code` set for cases the caller should surface to the UI.
 */
export async function findOrCreateGoogleUser(profile) {
    const googleId = profile.id;
    const emailEntry = profile.emails?.[0];
    const email = emailEntry?.value?.trim().toLowerCase();
    const avatar = profile.photos?.[0]?.value;

    if (!googleId || !email) {
        const err = new Error("Google did not return an email address");
        err.code = "google_no_email";
        throw err;
    }
    // Linking by email is only safe if Google itself vouches for the address
    if (emailEntry.verified !== true && profile._json?.email_verified !== true) {
        const err = new Error("Google email is not verified");
        err.code = "google_email_unverified";
        throw err;
    }

    // 1. returning Google user
    let user = await userModel.findOne({ googleId });
    if (user) return user;

    // 2. existing account with the same email -> link
    user = await userModel
        .findOne({ email })
        .select("+emailVerificationToken +emailVerificationExpires");
    if (user) {
        user.googleId = googleId;
        if (!user.avatar && avatar) user.avatar = avatar;
        if (!user.verified) {
            // Anti pre-hijack: this account was registered with a password but its owner
            // never proved they control the mailbox. Google just proved it, so the
            // person here is the real owner -> drop the unproven password and pending link.
            user.verified = true;
            user.password = undefined;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
        }
        await user.save();
        return user;
    }

    // 3. brand new user
    const username = await generateUniqueUsername(profile.displayName, email);
    try {
        return await userModel.create({ username, email, googleId, avatar, verified: true });
    } catch (error) {
        // Two parallel first-time sign-ins can race on the unique indexes; resolve to the winner.
        if (error?.code === 11000) {
            const existing = await userModel.findOne({ $or: [{ googleId }, { email }] });
            if (existing) return existing;
        }
        throw error;
    }
}