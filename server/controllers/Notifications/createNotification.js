// backend/controllers/Notifications/createNotification.js
import Notification from "../../models/Notification.js";

const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    const notification = new Notification({
      userId,
      message,
      type: type || "ItemUpdate",
    });

    await notification.save();
    res.status(201).json({ ok: true, notification });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({ ok: false, msg: "Failed to create notification" });
  }
};

export default createNotification;
