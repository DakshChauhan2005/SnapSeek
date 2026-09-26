import {Router} from "express";
import { loginValidator, registerValidation } from "../validator/auth.validator.js";
import { getMe, login, register, verifyEmail, logout } from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import authLimiter from "../middleware/authLimiter.middleware.js";
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
 * @desc Verify email address
 * @access Public
 * @body { token: String }
 */
router.post("/verify-email", verifyEmail)

/** 
 * @route POST /api/auth/logout
 * @desc Logout user and clear JWT token
 * @access Private
 * @body { deviceId: String }
 */

router.post("/logout", authUser, logout)


export default router;