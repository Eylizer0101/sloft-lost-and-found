// SERVER/models/Archive.js
import mongoose from "mongoose";

const ArchiveSchema = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  type: String,
  category: String,
  location: String,
  room: String,
  areaImage: String,
  date: String,
  number: String,
  img: [String],
  status: String,
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      date: { type: Date, default: Date.now },
    }
  ],
  // ✅ DAGDAG: Claim information
  claimedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullname: String,
    studentId: String,
    course: String,
    contact: String
  },
  dateArchived: { type: Date, default: Date.now },
}, { timestamps: true });

const Archive = mongoose.model("Archive", ArchiveSchema);
export default Archive;