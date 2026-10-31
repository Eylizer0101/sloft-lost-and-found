// SERVER/controllers/Claims/getClaimNotificationById.js
import ClaimNotification from "../../models/ClaimNotification.js";

const getClaimNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await ClaimNotification.findById(id)
      .populate("userId", "fullname studentId email course yearLevel contact")
      .populate("itemId", "name description room date img type status");

    if (!claim)
      return res
        .status(404)
        .json({ ok: false, msg: "Claim notification not found." });

    res.status(200).json({ ok: true, claim });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error fetching claim notification.",
    });
  }
};

export default getClaimNotificationById;
