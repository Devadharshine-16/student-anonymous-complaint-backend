// backend/node-mongodb-server/routes/studentRoutes.js  (ESM)
import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  const { studentID } = req.body;
  // Always succeed (temporarily)
  return res.status(200).json({
    message: "Login successful",
    studentID: studentID || "guest"
  });
});

export default router;
