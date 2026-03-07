import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true
    },
    brokerName: {
        type: String
    },
    applied: {
        type: Number,
        default: 0
    },
    allotted: {
        type: Number,
        default: 0
    },
    profit: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Member = mongoose.model('Member', memberSchema);