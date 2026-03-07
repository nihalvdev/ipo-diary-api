import { Router } from "express";
import { getAllFeedback, submitFeedback } from "../controller/feedback.controller.js";

const router = Router();

router.route("/submit").post(submitFeedback);

router.route("/get").get(getAllFeedback);

export default router;