import express from "express";
import validateToken from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import createClaimNotification from "../controllers/Claims/createClaimNotification.js";
import getAllClaimNotifications from "../controllers/Claims/getAllClaimNotifications.js";
import getClaimNotificationById from "../controllers/Claims/getClaimNotificationById.js";
import getPendingClaimsCount from "../controllers/Claims/getPendingClaimsCount.js";
import ClaimNotification from "../models/ClaimNotification.js";

const router = express.Router();

// 📩 User marks an item as claimed
router.post("/create", validateToken, createClaimNotification);

// 👀 Admin views all claim notifications
router.get("/", validateToken, isAdmin, getAllClaimNotifications);

// ✅ Pending claims count - DAPAT NASA TAAS BAGO ANG :id ROUTE
router.get("/pending-count", validateToken, isAdmin, getPendingClaimsCount);

// 🔄 Admin updates claim notification status
router.put("/:id/status", validateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const claim = await ClaimNotification.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({ ok: false, msg: "Claim not found" });
    }

    res.status(200).json({ ok: true, claim });
  } catch (error) {
    console.error("Error updating claim status:", error);
    res.status(500).json({ ok: false, msg: "Server error" });
  }
});

// 🔎 Admin views specific claim notification by ID - DAPAT NASA BABA
router.get("/:id", validateToken, isAdmin, getClaimNotificationById);

export default router;