import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    platform: {
        type: String,
        required: true,
        enum: ["ios", "android", "web"]
    },
    appVersion: {
        type: String
    }
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);