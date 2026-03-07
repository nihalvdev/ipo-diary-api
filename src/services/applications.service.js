import { Application } from "../models/applications.model.js";
import { Member } from "../models/member.modal.js";
import { ApiError } from "../utils/apiError.js";

export const addApplication = async (applicationData) => {
    const { userId, memberId, ipoId, lots, appliedPrice, applicationStatus, profit } = applicationData;

    const existing = await Application.findOne({ memberId, ipoId });
    if (existing) {
        throw new ApiError(409, "This member has already applied for this IPO.");
    }

    const application = await Application.create(applicationData);

    // We increment counts based on the status of this application
    const updateStats = {
        $inc: {
            applied: 1, // Always increment total applications
            profit: profit || 0 // Add profit (can be 0 or negative)
        }
    };

    if (applicationStatus === "allotted") {
        updateStats.$inc.allotted = 1; // Increment only if allotted
    }

    await Member.findByIdAndUpdate(memberId, updateStats);

    return application;
};

export const fetchApplications = async (userId, filters = {}) => {
    const query = { userId };

    if (filters.memberId) query.memberId = filters.memberId;
    if (filters.ipoId) query.ipoId = filters.ipoId;
    if (filters.status) query.applicationStatus = filters.status;

    const applications = await Application.find(query)
        .populate({
            path: "ipoId",
            select: "companyName logoUrl symbol pricing status issueType" // Fetch company info
        })
        .populate({
            path: "memberId",
            select: "name relation brokerName" // Fetch member info
        })
        .sort({ appliedDate: -1 }); // Show newest first

    return applications;
};

export const deleteApplication = async (userId, applicationId) => {
    const application = await Application.findOne({ userId, _id: applicationId });
    if (!application) {
        throw new ApiError(404, "Application not found or unauthorized access");
    }

    const { memberId, applicationStatus, profit } = application;

    const updateStats = {
        $inc: {
            applied: -1, // Decrease total application count
            profit: -(profit || 0) // Revert the profit added (subtracting it)
        }
    };

     if (applicationStatus === "allotted") {
        updateStats.$inc.allotted = -1;
    }

    // Revert stats on the Member document
    await Member.findByIdAndUpdate(memberId, updateStats);

    // Finally delete the application
    await Application.findByIdAndDelete(applicationId);

    return true;
};

export const updateApplication = async (userId, applicationId, updateData) => {
    const oldApplication = await Application.findOne({ userId, _id: applicationId });
    if (!oldApplication) {
        throw new ApiError(404, "Application not found or unauthorized");
    }

    const { applicationStatus: oldStatus, profit: oldProfit, memberId } = oldApplication;
    const { applicationStatus: newStatus, profit: newProfit } = updateData;

    let allottedDiff = 0;
    let profitDiff = 0;

    if (newStatus && newStatus !== oldStatus) {
        if (oldStatus !== "allotted" && newStatus === "allotted") allottedDiff = 1;
        if (oldStatus === "allotted" && newStatus !== "allotted") allottedDiff = -1;
    }

    if (newProfit !== undefined) {
        profitDiff = (newProfit || 0) - (oldProfit || 0);
    }

    if (allottedDiff !== 0 || profitDiff !== 0) {
        await Member.findByIdAndUpdate(memberId, {
            $inc: {
                allotted: allottedDiff,
                profit: profitDiff
            }
        });
    }

    // Update the actual application record
    const updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        { $set: updateData },
        { new: true, runValidators: true }
    );
    
    return updatedApplication;
}