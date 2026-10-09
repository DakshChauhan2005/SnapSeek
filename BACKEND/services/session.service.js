import jwt from "jsonwebtoken";
import { getDeviceType, upsertDeviceSession, getClientIp } from "./device.service.js";

/**
 * Creates the device session + JWT cookie for a user.
 * Shared by password login and Google OAuth so both produce identical sessions.
 */
export async function startSession(req, res, user, deviceId) {
    const userAgent = req.headers["user-agent"] || "";
    const deviceType = getDeviceType(userAgent);
    const lastIp = getClientIp(req);

    await upsertDeviceSession({ userId: user._id, deviceType, deviceId, userAgent, lastIp });

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        deviceType,
        deviceId
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
    return token;
}