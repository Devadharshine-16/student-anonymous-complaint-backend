import express from "express";
import Student from "../models/student.model.js"; // still imported for future use
import bcrypt from "bcryptjs"; // still here for future use

const router = express.Router();

// ================= STUDENT LOGIN (Bypass Version) =================
router.post("/student/login", async (req, res) => {
  // Skip validation — always return success
  res.json({ message: "Login successful" });
});

// ================= STUDENT REGISTER =================
router.post("/student/register", async (req, res) => {
  const { studentID, name, password, department, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      studentID,
      name,
      password: hashedPassword,
      department,
      email
    });
    await newStudent.save();
    res.json({ message: "Student registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
