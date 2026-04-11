import {Router} from "express";
import { loginValidator, registerValidation } from "../validator/auth.validator.js";
import { getMe, login, register, verifyEmail } from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const router = Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username: String, email: String, password: String 
 */
router.post("/register", registerValidation, register )

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email: String, password: String }
 */
router.post("/login", loginValidator , login )


/**
 * @route POST /api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */
router.get("/get-me", authUser , getMe)

/**
 * @route GET /api/auth/verify-email
 * @desc Verify email address
 * @access Public
 * @query { token: String }
 */
router.get("/verify-email", verifyEmail)


export default router;