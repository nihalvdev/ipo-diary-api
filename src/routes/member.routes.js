import { Router } from "express";
import { addMember, getAllMembers, getMemberDetails, removeMember } from "../controller/member.controller.js";
import { identifyUser } from "../middlewares/identifyUser.middleware.js";

const router = Router();

router.use(identifyUser);

router.get("/", getAllMembers);

router.post("/add", addMember);

router.route("/:id").get(getMemberDetails);

router.route("/delete/:id").delete(removeMember);

export default router;