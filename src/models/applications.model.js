import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
        index: true
    },
    ipoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ipo",
        required: true,
        index: true
    },
    lots: {
        type: Number,
        required: true,
        min: [1, "At least 1 lot must be applied"]
    },
    appliedPrice: {
        type: Number,
        required: true
    },
    appliedDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    applicationStatus: {
        type: String,
        required: true,
        enum: ["applied", "allotted", "not_allotted"],
        default: "applied"
    },
    profit: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// This ensures that the same member CANNOT apply for the same IPO twice.
applicationSchema.index({ memberId: 1, ipoId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);