import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { addApplication, deleteApplication, fetchApplications, updateApplication } from "../services/applications.service.js";

export const createApplication = asyncHandler(async (req, res) => {
    try {
       const { 
            ipoId, 
            memberId, 
            lots, 
            appliedPrice, 
            applicationStatus, 
            appliedDate, 
            profit 
        } = req.body;

        const userId = req.user?._id; 

        const required = ["ipoId", "memberId", "lots", "appliedPrice", "applicationStatus"];
        const missing = required.filter(field => !req.body[field]);
        if (missing.length > 0) {
            throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`);
        }

        const application = await addApplication({
            userId,
            ipoId,
            memberId,
            lots,
            appliedPrice,
            applicationStatus,
            appliedDate: appliedDate || new Date(),
            profit: profit || 0
        });

        return res.status(201).json(
            new ApiResponse(201, { application }, "Application recorded successfully!")
        );

    } catch (error) {
        console.error('Error while creating the application: ', error)
        throw new ApiError(500, 'Internal Server Error');
    }
});

export const getApplications = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
    
        const { memberId, ipoId, status } = req.query;
    
        if (!userId) {
            throw new ApiError(401, "User not identified");
        }
    
        const applications = await fetchApplications(userId, { 
            memberId, 
            ipoId, 
            status 
        });
    
        return res.status(200).json(
            new ApiResponse(
                200, 
                { 
                    count: applications.length,
                    applications 
                }, 
                "Applications fetched successfully"
            )
        );
    } catch (error) {
        console.error("Error while get the application: ", error)
    }
});

export const removeApplication = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, "Application ID is required");
        }
        await deleteApplication(userId, id);
        return res.status(200).json(
            new ApiResponse(200, null, "Application deleted and member stats updated successfully")
        );
    } catch (error) {
        console.error('Error deleting application:', error);
        throw new ApiError(error.statusCode || 500, error.message || "Failed to delete application");
    }
});

export const editApplication = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const updateFields = req.body;

        if (!id) {
            throw new ApiError(400, "Application ID is required");
        }

        // We explicitly prevent changing memberId or ipoId during an update 
        // to maintain relational integrity.
        delete updateFields.memberId;
        delete updateFields.ipoId;
        delete updateFields.userId;

        const updatedApplication = await updateApplication(userId, id, updateFields);

        return res.status(200).json(
            new ApiResponse(200, { application: updatedApplication }, "Application updated successfully")
        );
    } catch (error) {
        console.error('Error updating application:', error);
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});