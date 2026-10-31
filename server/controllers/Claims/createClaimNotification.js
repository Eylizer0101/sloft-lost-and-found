// SERVER/controllers/Claims/createClaimNotification.js
import ClaimNotification from "../../models/ClaimNotification.js";
import Item from "../../models/Item.js";
import User from "../../models/User.js";

const createClaimNotification = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.id; // ✅ Corrected to match validateToken.js

    const item = await Item.findById(itemId);
    if (!item)
      return res.status(404).json({ ok: false, msg: "Item not found." });

    // ✅ Get user to access course information
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ ok: false, msg: "User not found." });

    // ✅ Prevent claiming if item is already claimed
    if (item.status === "Claimed") {
      return res.status(400).json({ ok: false, msg: "This item has already been claimed." });
    }

    // ✅ Only allow claim requests on Found items
    if (item.type !== "Found") {
      return res.status(400).json({ ok: false, msg: "You can only claim found items." });
    }

    // ✅ Prevent duplicate pending claim requests by same user on same item
    const existing = await ClaimNotification.findOne({
      itemId,
      userId,
      status: "Pending",
    });

    if (existing) {
      return res.status(200).json({
        ok: false,
        msg: "You already sent a claim request for this item.",
      });
    }

    const newClaim = new ClaimNotification({
      itemId,
      userId,
      course: user.course, // ✅ ADD THIS LINE
      message: `User marked item "${item.name}" as claimed.`,
    });

    await newClaim.save();

    return res.status(201).json({
      ok: true,
      msg: "Claim notification sent successfully.",
      claim: newClaim,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Server error while creating claim notification.",
    });
  }
};

export default createClaimNotification;