import Notification from "../../models/Notification.js";

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ ok: true, msg: "Notification marked as read" });
  } catch (error) {
    console.error("❌ Error updating notification:", error);
    res.status(500).json({ ok: false, msg: "Failed to mark notification as read" });
  }
};

export default markAsRead;
