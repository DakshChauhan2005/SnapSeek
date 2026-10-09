import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true,
        trim: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    // Optional for accounts created through Google sign-in (they have no password)
    password: {
        type: String, 
        required: function () { return !this.googleId; },
        minlength: 6
    },
    // Google account "sub" id. sparse+unique: many users may have none, but no two may share one
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String,
        trim: true
    },
    verified: {
        type: Boolean, 
        default: false
    },
    emailVerificationToken: {
        type: String,
        select: false
    },
    emailVerificationExpires: {
        type: Date,
        select: false
    },
    updatedAt: {
        type: Date, 
        default: Date.now
    },
    createdAt: {
        type: Date, 
        default: Date.now
    }
}, { 
    timestamps: true 
});

userSchema.pre('save' ,  async function () {
    if (!this.password || !this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password , 10) 
} )

userSchema.methods.comparePassword = function (candidatePassword) {
    // Google-only accounts have no password hash to compare against
    if (!this.password) return Promise.resolve(false);
    return bcrypt.compare(candidatePassword , this.password)
}


const userModel = mongoose.model('User', userSchema);
export default userModel;