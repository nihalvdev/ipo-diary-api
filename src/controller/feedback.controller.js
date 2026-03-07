import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Feedback } from "../models/feedback.model.js";

export const submitFeedback = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id; 
        const { message } = req.body;

         if (!message || message.trim() === "") {
            throw new ApiError(400, "Please provide a feedback message");
        }

        if (message.length > 1000) {
            throw new ApiError(400, "Feedback cannot exceed 1000 characters");
        }

        const feedback = await Feedback.create({
            userId: userId || null,
            message: message.trim(),
        });

        if (!feedback) {
            throw new ApiError(500, "Failed to submit feedback. Please try again later");
        }

        return res.status(201).json(new ApiResponse(201, { feedback }, "Feedback submitted successfully"));

    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw new ApiError(500, "Error submitting feedback. Try later");
    }
});

export const getAllFeedback = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

     const pageOptions = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };
    
    const feedbacks = await Feedback.find()
        .sort({ createdAt: -1 })
        .skip((pageOptions.page - 1) * pageOptions.limit)
        .limit(pageOptions.limit)
        .populate("userId", "deviceId platform"); 

    const totalFeedbacks = await Feedback.countDocuments();

    return res.status(200).json(
            new ApiResponse(
                200, 
                {
                    feedbacks,
                    totalFeedbacks,
                    totalPages: Math.ceil(totalFeedbacks / pageOptions.limit),
                    currentPage: pageOptions.page,
                }, 
                "Feedbacks fetched successfully"
            )
        );
});