import { Router } from "express";
import { identifyUser } from "../middlewares/identifyUser.middleware.js";
import { createApplication, editApplication, getApplications, removeApplication } from "../controller/applications.controller.js";

const router = Router();

router.use(identifyUser);

router.route("/add").post(createApplication);

router.route("/all").get(getApplications);

router.route("/:id").delete(removeApplication)

router.route("/edit/:id").put(editApplication);

export default router;