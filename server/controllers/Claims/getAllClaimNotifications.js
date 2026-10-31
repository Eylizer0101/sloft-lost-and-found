// SERVER/controllers/Claims/getAllClaimNotifications.js
import ClaimNotification from "../../models/ClaimNotification.js";

const getAllClaimNotifications = async (req, res) => {
  try {
    console.log("🔄 Fetching all claim notifications...");
    
    const baseURL = `${req.protocol}://${req.get("host")}`;

    const claims = await ClaimNotification.find()
      .populate("userId", "fullname studentId course yearLevel contact")
      .populate("itemId", "name description room date type status img")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${claims.length} claims`);

    if (!claims || claims.length === 0) {
      return res.status(200).json({
        ok: true,
        claims: [],
        msg: "No claim notifications yet.",
      });
    }

    // ✅ Ayusin image URL bago ibalik sa frontend
    const formattedClaims = claims.map((claim) => {
      const claimObj = claim.toObject();
      if (claimObj.itemId?.img?.length > 0) {
        claimObj.itemId.img = claimObj.itemId.img.map((path) =>
          path.startsWith("http") ? path : `${baseURL}/${path}`
        );
      }
      return claimObj;
    });

    return res.status(200).json({
      ok: true,
      claims: formattedClaims,
    });
  } catch (error) {
    console.error("❌ Error fetching claim notifications:", error);
    res.status(500).json({
      ok: false,
      msg: "Server error while fetching claim notifications.",
    });
  }
};

export default getAllClaimNotifications;