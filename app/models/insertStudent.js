import express from 'express';
import Student from '../models/student.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { studentID, password } = req.body;

  try {
    const student = await Student.findOne({ studentID });
    if (!student) {
      return res.status(400).json({ message: 'Invalid Student ID or password' });
    }

    // Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Student ID or password' });
    }

    res.json({
      message: 'Login successful',
      studentID: student.studentID,
      name: student.name
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
