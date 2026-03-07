import { User } from "../models/user.model.js"

export const createOrGetUser = async ({ deviceId, platform, appVersion }) => {
    let user = await User.findOne({ deviceId });

    if(!user) {
        user = await User.create({
            deviceId,
            platform,
            appVersion
        });
    }

    return user;
};