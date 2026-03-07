import { Router } from "express";
import { createUser, getMe, loginAdmin, logoutAdmin } from "../controller/auth.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(createUser);

router.route("/admin/login").post(loginAdmin);

router.route("/admin/me").get(verifyAdminJWT, getMe);

router.route("/admin/logout").post(verifyAdminJWT, logoutAdmin);

export default router;