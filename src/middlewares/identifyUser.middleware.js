import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const identifyUser = async (req, res, next) => {
    try {
        const userId = req.headers["x-device-id"];

        if (!userId) {
            throw new ApiError(400, "Device ID is required");
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid User ID format");
        }

        const user = await User.findById(userId);

        console.log("User: ", user)

        if (!user) {
            throw new ApiError(400, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Failed to identify user");
    }
}