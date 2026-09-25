import {UAParser} from 'ua-parser-js';
import deviceModel from '../model/device.model.js';
export function getDeviceType (useAgent) {
    const parser = new UAParser(useAgent);
    const deviceType = parser.getDevice().type;
    return deviceType === 'mobile' ? 'mobile' : 'pc';
}

export function getClientIp(req) {
    // Get the client's IP address from the request headers or connection info
    return (req.headers["x-forwarded-for"]?.split(",")[0]?.trim()) || req.ip;
}

export async function upsertDeviceSession({userId, deviceType, deviceId,userAgent, lastIp}) {
    const device = await deviceModel.findOneAndUpdate(
        { userId, deviceType },
        { deviceId, userAgent, lastIp, lastLoginAt: new Date() },
        { upsert: true, returnDocument: 'after' }
    );
    return device;
}