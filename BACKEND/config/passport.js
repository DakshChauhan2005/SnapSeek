import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "../services/googleAuth.service.js";

export const isGoogleAuthConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL
);

if (isGoogleAuthConfigured) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                // Must be the full URL and must match an "Authorized redirect URI" in Google Cloud exactly
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await findOrCreateGoogleUser(profile);
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
} else {
    console.warn("Google OAuth disabled: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL to enable it.");
}

export default passport;