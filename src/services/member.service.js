import { Application } from "../models/applications.model.js";
import { Member } from "../models/member.modal.js";
import { ApiError } from "../utils/apiError.js";

export const createMember = async (memberData) => {
    try {
        const member = await Member.create(memberData);
        return member;
    } catch (error) {
        console.error('Error creating member:', error);
        throw new ApiError(500, "Failed to create member");
    }
};

export const getMembers = async (userId) => {
    try {
        const members = await Member.find({ userId }).sort({ createdAt: -1 });
        return members;
    } catch (error) {
        console.error('Error fetching members:', error);
        throw new ApiError(500, "Failed to fetch members");
    }
};

export const fetchMember = async (userId, memberId) => {
    const member = await Member.findOne({ userId, _id: memberId });
    if (!member) {
        throw new ApiError(404, "Member not found or unauthorized access to this record");
    }

    return member;
};

export const deleteMember = async (userId, memberId) => {
    const member = await Member.findOne({ userId, _id: memberId });

    if (!member) {
        throw new ApiError(404, "Member not found or unauthorized access to this record");
    }

    // 1. Cascade delete all applications related to this member
    await Application.deleteMany({ memberId });

    // 2. Delete the member themselves
    await Member.findByIdAndDelete(memberId);

    return true;
}
