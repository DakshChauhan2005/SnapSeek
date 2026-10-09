import userModel from "../model/user.model.js";
import deviceModel from "../model/device.model.js";
import { startSession } from "../services/session.service.js";
import { sendMail } from "../services/mail.service.js";
import crypto from "crypto";

const VERIFICATION_TTL_MS = 60 * 60 * 1000; // link valid for 1 hour
const RESEND_COOLDOWN_MS = 60 * 1000;       // min gap between verification mails

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

function generateVerificationToken() {
    const rawToken = crypto.randomBytes(32).toString("hex");
    return {
        rawToken,
        hashedToken: hashToken(rawToken),
        expires: new Date(Date.now() + VERIFICATION_TTL_MS)
    };
}

function sendVerificationMail(email, rawToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${rawToken}`;
    return sendMail({
        to: email,
        subject: "Verify your SnapSeek email",
        html: `
                <div style="margin: 0; padding: 48px 20px; background-color: #f5f4ef; color: #20211f; font-family: Arial, Helvetica, sans-serif;">
                    <div style="max-width: 560px; margin: 0 auto;">
                        <p style="margin: 0 0 8px; color: #747a70; font-size: 11px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase;">SnapSeek</p>
                        <h1 style="margin: 0 0 24px; color: #20211f; font-size: 28px; line-height: 1.2;">Verify your email</h1>

                        <div style="padding: 36px; border: 1px solid #deded6; border-radius: 16px; background-color: #ffffff;">
                            <div style="width: 54px; height: 54px; margin-bottom: 24px; border-radius: 14px; background-color: #dce8d8; color: #436448; font-size: 27px; line-height: 54px; text-align: center;">&#9993;</div>
                            <p style="margin: 0 0 12px; color: #20211f; font-size: 22px; font-weight: bold; line-height: 1.3;">One quick step</p>
                            <p style="margin: 0 0 28px; color: #697067; font-size: 15px; line-height: 1.7;">Thanks for joining SnapSeek. Confirm your email address to unlock your workspace and start your first conversation.</p>
                            <a href="${verificationUrl}" style="display: inline-block; padding: 14px 22px; border-radius: 10px; background-color: #20211f; color: #f8f8f4; font-size: 14px; font-weight: bold; text-decoration: none;">Verify my email</a>
                        </div>

                        <p style="margin: 20px 0 0; color: #899087; font-size: 12px; line-height: 1.6;">This link can be used once and expires in 1 hour. Do not forward this email. If you did not create a SnapSeek account, you can safely ignore it.</p>
                    </div>
                </div>
                `,
        text: `Thanks for joining SnapSeek. Verify your email here (single use, expires in 1 hour): ${verificationUrl}`
    });
}

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        const isUserExist = await userModel.findOne({
            $or: [{ email }, { username }]
        });
        if (isUserExist) {
            return res.status(409).json({
                sucess: false,
                message: "User with this email or username already exists",
                err: "User already exists"
            });
        }

        const { rawToken, hashedToken, expires } = generateVerificationToken();
        const user = await userModel.create({
            username,
            email,
            password,
            emailVerificationToken: hashedToken,
            emailVerificationExpires: expires
        });

        const mailResponse = await sendVerificationMail(user.email, rawToken);
        if (!mailResponse) {
            console.error("Error sending verification email");
            await userModel.deleteOne({ _id: user._id });
            return res.status(500).json({
                sucess: false,
                message: "Registration could not be completed because the verification email could not be sent. Please try again later.",
                err: "Email delivery failed"
            });
        }
        res.status(201).json({
            sucess: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        })

    } catch (error) {
        console.error("Error in user registration", error);
        res.status(500).json({
            sucess: false,
            message: "Internal Server Error",
            err: error.message
        })
    }
}

export async function login(req, res) {
    const {email , password, deviceId} = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({
                sucess: false,
                message: "Invalid email or password!",
                err: "Invalid email or password!"
            })
        }
        if (!user.password) {
            // Account was created through Google and has no password
            return res.status(400).json({
                sucess: false,
                message: "This account uses Google sign-in. Please continue with Google.",
                err: "Google account"
            })
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                sucess: false,
                message: "Invalid email or password",
                err: "Invalid email or password"
            })
        }
        if (!user.verified){
            return res.status(400).json({
                sucess: false,
                message: "Email not verified. Please verify your email to login.",
                err: "Email not verified"
            })
        }
        if (!deviceId) {
            return res.status(400).json({
                sucess: false,
                message: "deviceId is required", 
                err: "Missing deviceId" 
            });
        }

        await startSession(req, res, user, deviceId);
        res.status(200).json({
            sucess: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Error in user login", error);
        res.status(500).json({
            sucess: false,
            message: "Internal Server Error",
            err: error.message
        })
    }
}

export async function verifyEmail(req, res) {
    const { token } = req.body;
    if (!token || typeof token !== "string") {
        return res.status(400).json({
            sucess: false,
            message: "Token is required",
            err: "Token is required"
        })
    }
    try {
        const user = await userModel
            .findOne({
                emailVerificationToken: hashToken(token),
                emailVerificationExpires: { $gt: new Date() }
            })
            .select("+emailVerificationToken +emailVerificationExpires");

        if (!user) {
            return res.status(400).json({
                sucess: false,
                message: "This verification link is invalid, already used, or has expired.",
                err: "Invalid token"
            })
        }

        // burn the token so the link cannot be reused
        user.verified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Intentionally NOT logging the user in: whoever holds the link
        // must not get a session. The user signs in with their password.
        return res.status(200).json({
            sucess: true,
            message: "Email verified successfully. Please sign in."
        });
    } catch (error) {
        console.error("Error in email verification", error);
        res.status(500).json({
            sucess: false,
            message: "Internal Server Error",
            err: error.message
        })
    }
}

export async function resendVerification(req, res) {
    const genericResponse = {
        sucess: true,
        message: "If an unverified account exists for this email, a new verification link has been sent."
    };
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const user = await userModel
            .findOne({ email })
            .select("+emailVerificationExpires");

        if (!user || user.verified) {
            return res.status(200).json(genericResponse);
        }

        if (user.emailVerificationExpires) {
            const lastSentAt = user.emailVerificationExpires.getTime() - VERIFICATION_TTL_MS;
            if (Date.now() - lastSentAt < RESEND_COOLDOWN_MS) {
                return res.status(429).json({
                    sucess: false,
                    message: "Please wait a minute before requesting another link.",
                    err: "Too many requests"
                });
            }
        }

        const { rawToken, hashedToken, expires } = generateVerificationToken();
        user.emailVerificationToken = hashedToken; // replaces (invalidates) any older link
        user.emailVerificationExpires = expires;
        await user.save();

        const mailResponse = await sendVerificationMail(user.email, rawToken);
        if (!mailResponse) {
            console.error("Error sending verification email (resend)");
        }
        return res.status(200).json(genericResponse);
    } catch (error) {
        console.error("Error in resend verification", error);
        res.status(500).json({
            sucess: false,
            message: "Internal Server Error",
            err: error.message
        })
    }
}


export async function getMe(req, res){
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");
    if (!user){
        return res.status(404).json({
            sucess: false,
            message: "User not found",
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched succesfully",
        succes: true,
        user
    })
}

export async function logout(req, res){
    try{
        const userId = req.user.id;
        const deviceId = req.user.deviceId;
        if(!deviceId){
            return res.status(400).json({
                sucess: false,
                message: "deviceId is required",
                err: "Missing deviceId"
            })
        }
        await deviceModel.findOneAndDelete({ userId, deviceId });
        res.clearCookie("token");
        res.status(200).json({
            sucess: true,
            message: "Logout successful"
        })
    } catch (error){
        console.error("Error in user logout", error);
        res.status(500).json({
            sucess: false,
            message: "Internal Server Error",
            err: error.message
        })
    }
}