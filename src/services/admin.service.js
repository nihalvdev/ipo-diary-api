import { Ipo } from "../models/ipo.model.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/applications.model.js";
import { ApiError } from "../utils/apiError.js";

export const createNewIpo = async (ipoData) => {
    try {
        const ipo = await Ipo.create(ipoData);
        if (!ipo) {
            throw new ApiError(500, "Something went wrong while creating the IPO");
        }
        return ipo;
    } catch (error) {
        console.error('Error while creating IPO: ', error);
        throw error;
    }
};

export const updateIpoDetails = async (ipoId, ipoData) => {
    try {
        const ipo = await Ipo.findByIdAndUpdate(
            ipoId,
            { $set: ipoData },
            { new: true, runValidators: true }
        );

        if (!ipo) {
            throw new ApiError(404, "IPO not found");
        }

        return ipo;
    } catch (error) {
        console.error('Error while updating IPO: ', error);
        throw error;
    }
};

export const deleteIpo = async (ipoId) => {
    try {
        await Application.deleteMany({ ipoId });

        const ipo = await Ipo.findByIdAndDelete(ipoId);

        if (!ipo) {
            throw new ApiError(404, "IPO not found");
        }

        return ipo;
    } catch (error) {
        console.error('Error while deleting IPO: ', error);
        throw error;
    }
};

export const getUsersDetails = async (page = 1, limit = 10, search = '') => {
    try {
        const skip = (page - 1) * limit;

        const matchStage = {}
        if (search) {
            // Searching by deviceId if provided
            matchStage.deviceId = { $regex: search, $options: "i" };
        }

        const stats = await User.aggregate([
            { $match: matchStage },
            {
                // Join with applications collection
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "userId",
                    as: "applications"
                }
            },
            {
                // Join with members collection
                $lookup: {
                    from: "members",
                    localField: "_id",
                    foreignField: "userId",
                    as: "members"
                }
            },
            {
                $project: {
                    deviceId: 1,
                    device: "$platform", // mapping platform field to 'device' as requested
                    totalApplications: { $size: "$applications" },
                    totalMembers: { $size: "$members" },
                    createdAt: 1
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ]);

        const totalUsers = await User.countDocuments(matchStage);

        return {
            users: stats,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        };

    } catch (error) {
        console.error('Error while fetching user statistics: ', error);
        throw error;
    }
};

export const getUserStats = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const androidUsers = await User.countDocuments({ platform: "android" });
        const iosUsers = await User.countDocuments({ platform: "ios" });
        const totalApplications = await Application.countDocuments();

        return {
            totalUsers,
            androidUsers,
            iosUsers,
            totalApplications
        };
    } catch (error) {
        console.error('Error while fetching dashboard stats: ', error);
        throw error; 
    }
};
