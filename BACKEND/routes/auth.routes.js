import {Router} from "express";
import { loginValidator, registerValidation, resendVerificationValidator } from "../validator/auth.validator.js";
import { getMe, login, register, verifyEmail, resendVerification, logout } from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import authLimiter from "../middleware/authLimiter.middleware.js";
import { startGoogleAuth, googleCallback } from "../controller/googleAuth.controller.js";
const router = Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username: String, email: String, password: String 
 */
router.post("/register",authLimiter , registerValidation, register )

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email: String, password: String }
 */
router.post("/login",authLimiter , loginValidator , login )


/**
 * @route POST /api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */
router.get("/get-me", authUser , getMe)

/**
 * @route POST /api/auth/verify-email
 * @desc Verify user email with token
 * @access Public
 * @body { token: String, deviceId: String }
 */
router.post("/verify-email", verifyEmail)

/**
 * @route POST /api/auth/resend-verification
 * @desc Send a fresh verification link (old link stops working)
 * @access Public
 * @body { email: String }
 */
router.post("/resend-verification", authLimiter, resendVerificationValidator, resendVerification)

/** 
 * @route POST /api/auth/logout
 * @desc Logout user and clear JWT token
 * @access Private
 * @body { deviceId: String }
 */

router.post("/logout", authUser, logout)

/**
 * @route GET /api/auth/google
 * @desc Start Google OAuth (redirects to Google's consent screen)
 * @access Public
 * @query { deviceId: String }
 */
router.get("/google", authLimiter, startGoogleAuth)

/**
 * @route GET /api/auth/google/callback
 * @desc Google redirects back here; creates the session cookie and redirects to the frontend
 * @access Public (called by Google)
 */
router.get("/google/callback", googleCallback)


export default router;