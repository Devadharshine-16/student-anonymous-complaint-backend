import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  studentID: { type: String, required: true, unique: true, trim: true },
  name:      { type: String, required: true, trim: true },
  password:  { type: String, required: true }, // bcrypt hash
  department:{ type: String, required: true, trim: true },
  email:     { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model("Student", StudentSchema);
