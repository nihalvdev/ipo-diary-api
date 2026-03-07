import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { createOrGetUser } from "../services/auth.service.js";
import { Admin } from "../models/admin.model.js";

export const createUser = asyncHandler(async (req, res) => {
    try {
        const { deviceId, platform } = req.body;
        console.log("req.body.....", req.body);

        if (!deviceId) {
            throw new ApiError(400, "DeviceId and platform are required");
        };

        let appVersion = '1.1.0'

        const user = await createOrGetUser({
            deviceId,
            platform,
            appVersion
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { user },
                    "User created successfully"
                )
            )
    } catch (error) {
        console.error("Error in creating user: ", error);
        throw new ApiError(404, "Error in creating error")
    }
});

export const loginAdmin = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    // 1. Validate input
    if (!userName || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    // 2. Find admin by username
    const admin = await Admin.findOne({ userName });
    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    // 3. Check password using the method we defined in the Model
    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    // 4. Generate Access Token
    const accessToken = admin.generateAccessToken();

    // 5. Send response (and set a cookie)
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        .json(
            new ApiResponse(200, {
                admin: { username: admin.userName },
                accessToken
            }, "Admin logged in successfully")
        );
});

export const getMe = asyncHandler(async (req, res) => {
    // req.admin is set by the verifyAdminJWT middleware
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                { admin: { username: req.admin.userName } }, 
                "Admin fetched successfully"
            )
        );
});

export const logoutAdmin = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});
