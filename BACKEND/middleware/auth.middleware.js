import jwt from "jsonwebtoken"
import  deviceModel from "../model/device.model.js";



export async function authUser(req, res ,next){
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                sucess: false,
                message: "Unauthorized. No token provided.",
                err: "No token provided"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const device = await deviceModel.findOne({userId: decoded.id, deviceType: decoded.deviceType})
        if(!device || device.deviceId !== decoded.deviceId){
            res.clearCookie("token");
            return res.status(401).json({
                sucess: false,
                message: "Unauthorized. Device mismatch.",
                err: "Device mismatch"
            })
        }
        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).json({
            sucess: false,
            message: "Unauthorize",
            err: "Invalid Token"
        })
    }

}