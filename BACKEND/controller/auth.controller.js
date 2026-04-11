import userModel from "../model/user.model.js";
import { sendMail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        const isUserExist = await userModel.findOne({
            $or: [{ email }, { username }]
        });
        if (isUserExist) {
            return res.status(400).json({
                sucess: false,
                message: "User with this email or username already exists",
                err: "User already exists"
            });
        }
        const user = await userModel.create({ username, email, password });
        const emailVerificationToken = jwt.sign({
                email: user.email,
            },
            process.env.JWT_SECRET
        );
        await sendMail({
            to: email,
            Subject: "Welcome to perplexity",
            html: `
                <h1>Welcome to perplexity</h1>
                <p>Thank you for registering with us. We're excited to have you on board!</p>
                <p>To get started, please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify your email</a>
                `,
            text: "Welcome to perplexity. Thank you for registering with us. We're excited to have you on board!"
        })
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
    const {email , password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({
                sucess: false,
                message: "Invalid email or password",
                err: "Invalid email or password"
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

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {expiresIn: "7d"})
        
        res.cookie("token", token )
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
    const {token} = req.query;
    if (!token) {
        return res.status(400).json({
            sucess: false,
            message: "Token is required",
            err: "Token is required"
        })
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        const user = await userModel.findOne({email: decoded.email});
        if (!user) {
            return res.status(400).json({
                sucess: false,
                message: "Invalid token",
                err: "Invalid token"
            })
        }
        user.verified = true
        await user.save();
        res.send(`
            <h1>Email verified successfully</h1>
            <p>Your email has been verified successfully. You can now login to your account.</p>
            <a href="http://localhost:3000/login">Go to login</a>
        `)
    } catch (error) {
        console.error("Error in email verification", error);
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
        res.status(404).json({
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