import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceType: {
        type: String,
        enum: ["pc", "mobile"],
        required: true,
    },
    deviceId: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    lastIp: {
        type: String,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

deviceSchema.index({ userId: 1, deviceType: 1 }, { unique: true });

const deviceModel = mongoose.model('Device', deviceSchema);
export default deviceModel;