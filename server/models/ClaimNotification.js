// SERVER/models/ClaimNotification.js
import mongoose from "mongoose";

const claimNotificationSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "A user marked an item as claimed.",
    },
    status: {
      type: String,
      enum: ["Pending", "Claimed", "Rejected"],
      default: "Pending",
    },
    // ❌ TANGGALIN ANG COURSE FIELD DITO
  },
  { timestamps: true }
);

const ClaimNotification = mongoose.model("ClaimNotification", claimNotificationSchema);
export default ClaimNotification;