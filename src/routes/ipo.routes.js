import { Router } from "express";
import { getAllIpos, getIpoDetails, searchIpo } from "../controller/ipo.controller.js";

const router = Router();

router.route("/getAll/:issueType").get(getAllIpos);

router.route("/search").get(searchIpo);

router.route("/:id").get(getIpoDetails);

export default router