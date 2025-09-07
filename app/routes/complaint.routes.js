import express from "express";
import {
    createComplaint,
    getAllComplaints,
    getComplaintsByStudent,
    updateComplaint,
    deleteComplaint
} from "../controllers/complaint.controller.js";

const router = express.Router();

// Complaint routes
router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.get("/user/:studentID", getComplaintsByStudent); // accepts studentID or trackingCode
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

export default router;
