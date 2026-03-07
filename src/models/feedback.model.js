import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, 
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    },
}, { timestamps: true });

export const Feedback = mongoose.model("Feedback", feedbackSchema);