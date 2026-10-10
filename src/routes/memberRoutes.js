
import express from "express";
import {
    getMembers,
    getMember,
    addMember,
    editMember,
    removeMember
} from "../controllers/memberController.js";

const router = express.Router();

router.get("/", getMembers);
router.get("/:id", getMember);
router.post("/", addMember);
router.put("/:id", editMember);
router.delete("/:id", removeMember);

export default router;
