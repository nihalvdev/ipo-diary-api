import mongoose from "mongoose";

const ipoSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String
    },
    issueType: {
        type: String,
        required: true,
        enum: ["mainboard", "sme"]
    },
    status: {
        type: String,
        required: true,
        enum: ["upcoming", "open", "closed"]
    },
    openDate: {
        type: Date,
        required: true
    },
    closeDate: {
        type: Date,
        required: true
    },
    listingDate: {
        type: Date,
        required: true
    },
    price: {
        type: String,
        require: true
    },
    lotSize: {
        type: Number,
        required: true
    },
    minInvestament: {
        type: Number,
        required: true
    },
    issueSize: {
        type: String,
        required: true
    },
    about: {
        type: String
    }
}, {
    timestamps: true
});

export const Ipo = mongoose.model("Ipo", ipoSchema);