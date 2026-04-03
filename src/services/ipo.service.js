import { Ipo } from "../models/ipo.model.js"
import { ApiError } from "../utils/apiError.js";

export const fetchAllIpos = async ({
  issueType,
  status,
  page,
  limit,
}) => {
  const filter = {};

  // Optional issueType filter
  if (issueType && ["mainboard", "sme"].includes(issueType)) {
    filter.issueType = issueType;
  }

  // Optional status filter
  if (status && ["open", "close", "upcoming"].includes(status)) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [ipos, total] = await Promise.all([
    Ipo.find(filter)
      .sort({ openDate: -1 })
      .skip(skip)
      .limit(limit),
    Ipo.countDocuments(filter),
  ]);

  return {
    ipos,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

export const getIpoById = async ({ ipoId }) => {
  const ipo = await Ipo.findOne({ _id: ipoId });

  if (!ipo) {
    throw new ApiError(404, "IPO not found");
  };

  return ipo;
};

export const searchIpoByName = async (companyName) => {
  const escapedName = companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const ipos = await Ipo.find({
    companyName: { $regex: escapedName, $options: "i" }
  }).limit(10).sort({ openDate: -1 });

  return ipos;
}