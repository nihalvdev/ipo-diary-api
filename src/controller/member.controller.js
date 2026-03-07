import { asyncHandler } from "../utils/asyncHandler.js";
import { createMember, deleteMember, fetchMember, getMembers } from "../services/member.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const addMember = asyncHandler(async (req, res) => {
    try {
        const { name, relation, brokerName } = req.body;
        const userId = req.user?._id;

        if (!name || !relation) {
            throw new ApiError(400, "Name and relation are required");
        }

        const member = await createMember({
            userId,
            name,
            relation,
            brokerName
        });

        return res.status(201).json(
            new ApiResponse(201, { member }, "Member added successfully")
        );
    } catch (error) {
        console.error('Error adding member:', error);
        throw new ApiError(500, "Failed to add member");
    }
});

export const getAllMembers = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;

        const members = await getMembers(userId);

        return res.status(200).json(
            new ApiResponse(200, { members }, "Members fetched successfully")
        );
    } catch (error) {
        console.error('Error fetching members:', error);
        throw new ApiError(500, "Failed to fetch members");
    }
});

export const getMemberDetails = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, "Member ID is required");
        }

        const member = await fetchMember(userId, id);

        return res.status(200).json(
            new ApiResponse(200, { member }, "Member details fetched successfully")
        );
    } catch (error) {
        console.error('Error fetching member details:', error);
        throw new ApiError(500, "Failed to fetch member details");
    }
});

export const removeMember = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, "Member ID is required");
        }

        await deleteMember(userId, id);

        return res.status(200).json(
            new ApiResponse(200, null, "Member and all related applications deleted successfully")
        );
        
    } catch (error) {
        console.error('Error deleting member:', error);
        throw new ApiError(error.statusCode || 500, error.message || "Failed to delete member");
    }
})
