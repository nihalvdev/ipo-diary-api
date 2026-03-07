import { Router } from "express";
import { getAllIpos, getIpoDetails } from "../controller/ipo.controller.js";

const router = Router();

router.route("/getAll/:issueType").get(getAllIpos);

router.route("/:id").get(getIpoDetails);

export default router