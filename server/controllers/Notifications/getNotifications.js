import Notification from "../../models/Notification.js";
import Item from "../../models/Item.js"; // ✅ IDINAGDAG: Para ma-access ang Item model

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kunin lahat ng notifications ng user (pinakabago sa taas)
    let notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    // ✅ TEMPORARY FIX: Add itemId to existing notifications that don't have one
    for (let notification of notifications) {
      if (!notification.itemId && notification.message.includes('posted a new')) {
        // Hanapin ang latest na item na may pangalan na match sa notification message
        const itemNameMatch = notification.message.match(/posted a new (?:lost|found) item: "([^"]+)"/);
        if (itemNameMatch) {
          const itemName = itemNameMatch[1];
          const matchingItem = await Item.findOne({ name: itemName }).sort({ createdAt: -1 });
          if (matchingItem) {
            notification.itemId = matchingItem._id;
            await notification.save();
            console.log(`✅ Added itemId ${matchingItem._id} to notification for item: ${itemName}`);
          }
        }
      }
    }

    // Refresh the notifications after update
    notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    // ✅ Directly return array para compatible sa frontend
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return res.status(500).json({
      ok: false,
      msg: "Failed to get notifications",
    });
  }
};

export default getNotifications;