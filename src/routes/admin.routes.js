import { Router } from "express";
import { addIpo, getUsers, getUserStatistics, removeIpo, updateIpo } from "../controller/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add").post(upload.single("image"), addIpo);

router.route("/delete/:ipoId").delete(removeIpo);

router.route("/update/:ipoId").put(upload.single("image"), updateIpo);

router.route("/users").get(getUsers);

router.route("/stats").get(getUserStatistics);

export default router;