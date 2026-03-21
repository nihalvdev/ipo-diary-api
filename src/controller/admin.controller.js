import { createNewIpo, deleteIpo, getUsersDetails, getUserStats, updateIpoDetails } from "../services/admin.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cludinary.js";

export const addIpo = asyncHandler(async (req, res) => {
    const {
        companyName, issueType, status,
        openDate, closeDate, listingDate, price,
        lotSize, minInvestment, issueSize, about
    } = req.body;

    const localPath = req.file?.path;

    if (!localPath) {
        throw new ApiError(400, "Image file is required");
    }

    const cloudinaryResult = await uploadOnCloudinary(localPath);

    if (!cloudinaryResult) {
        throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    // 2. Extract the secure URL from Cloudinary result
    const logoUrl = cloudinaryResult.secure_url;

    const requiredFields = [
        "companyName", "issueType", "status", "openDate",
        "closeDate", "listingDate", "price", "lotSize",
        "minInvestment", "issueSize"
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    const validIssueTypes = ["mainboard", "sme"];
    const validStatuses = ["upcoming", "open", "closed"];
    if (!validIssueTypes.includes(issueType)) {
        throw new ApiError(400, `Invalid issueType. Must be one of: ${validIssueTypes.join(", ")}`);
    }
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const ipo = await createNewIpo({
        companyName, logoUrl, issueType, status,
        openDate, closeDate, listingDate, price,
        lotSize, minInvestment, issueSize, about
    });

    return res.status(201).json(
        new ApiResponse(201, { ipo }, "IPO added successfully!")
    );
});

export const updateIpo = asyncHandler(async (req, res) => {
    const { ipoId } = req.params;
    const updateData = req.body;

    if (!ipoId) {
        throw new ApiError(400, "IPO ID is required");
    }

    if (req.file) {
        const localPath = req.file.path;
        
        // Upload new image to Cloudinary
        const cloudinaryResult = await uploadOnCloudinary(localPath);
        
        if (!cloudinaryResult) {
            throw new ApiError(500, "Failed to upload new image to Cloudinary");
        }
        
        // Add the new Cloudinary URL into our updateData object
        updateData.logoUrl = cloudinaryResult.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No data provided for update");
    }

    const updatedIpo = await updateIpoDetails(ipoId, updateData);

    return res.status(200).json(
        new ApiResponse(200, updatedIpo, "IPO updated successfully")
    );
});

export const removeIpo = asyncHandler(async (req, res) => {
    const { ipoId } = req.params;

    if (!ipoId) {
        throw new ApiError(400, "IPO ID is required");
    }

    await deleteIpo(ipoId);

    return res.status(200).json(
        new ApiResponse(200, {}, "IPO and associated applications deleted successfully")
    );
});

export const getUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    const data = await getUsersDetails(page, limit, search);

    return res.status(200).json(
        new ApiResponse(200, data, "Users fetched successfully")
    );
});

export const getUserStatistics = asyncHandler(async (req, res) => {
    const stats = await getUserStats();

    return res.status(200).json(
        new ApiResponse(200, stats, "Dashboard stats fetched successfully")
    );
});