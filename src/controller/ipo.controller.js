import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { fetchAllIpos, getIpoById, searchIpoByName } from "../services/ipo.service.js";

export const getAllIpos = asyncHandler(async (req, res) => {
  const { issueType } = req.params;
  const { status, page, limit } = req.query;

  const result = await fetchAllIpos({ status, issueType, page, limit });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ipos: result.ipos,
        pagination: result.pagination,
      },
      "IPO Fetched successfully!!"
    )
  );
});

export const getIpoDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ipo = await getIpoById({ ipoId: id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ipo },
        "IPO details fetched successfully"
      )
    );
});

export const searchIpo = asyncHandler(async (req, res) => {
  const { searchQuery } = req.query;

  if (!searchQuery || searchQuery.trim() === "") {
    return res.status(200).json(new ApiResponse(200, { ipos: [] }, "Search query is empty"));
  }

  const ipos = await searchIpoByName(searchQuery);

  return res.status(200).json(
    new ApiResponse(
      200,
      { ipos },
      "IPO search results fetched successfully"
    )
  );
})