// backend/controllers/Items/createItem.js
import Item from "../../models/Item.js";
import User from "../../models/User.js";
import Notification from "../../models/Notification.js";
import  sendEmailNotification  from "../../utils/sendEmailNotification.js";

const createItem = async (req, res) => {
  try {
    const itemData = req.body;

    // ✅ Create new item (auto-approved na)
    const newItem = new Item({
      ...itemData,
      status: "Pending", // ✅ Directly approved instead of pending
      category: itemData.category || "Others",
      areaImage: itemData.areaImage || "",
      img:
        req.files && req.files.length > 0
          ? req.files.map((file) => `uploads/${file.filename}`)
          : [],
    });

    await newItem.save();

    try {
      // ✅ Get user who posted the item
      const postingUser = await User.findById(itemData.userId);
  
      if (postingUser) {
        // ✅ Create a system-wide notification for all users
        const allUsers = await User.find();
  
        const notifications = allUsers.map((user) => ({
          userId: user._id,
          message: `${postingUser.fullname} posted a new ${newItem.type === "Found" ? "found" : "lost"} item: "${newItem.name}".`,
          type: "ItemUpdate",
          itemId: newItem._id, // ✅ IDINAGDAG: Item ID para sa redirection
          isRead: false,
        }));
  
        await Notification.insertMany(notifications);
  
        // ✅ SEND EMAIL NOTIFICATION TO ADMIN
        try {
          await sendEmailNotification({
            to: "sloftlostandfound@gmail.com",
            subject: `📢 New ${newItem.type} Item Posted - ${newItem.name}`,
            item: newItem,
            user: postingUser
          });
          console.log('✅ Email notification sent to sloftlostandfound@gmail.com');
        } catch (emailError) {
          console.error('❌ Failed to send email notification:', emailError);
          // Don't fail the request if email fails
        }
      }
    } catch (notificationError) {
      // The item was saved; notification failure should not cause a false 500.
      console.error("Notification failed after item was saved:", notificationError);
    }

    res.status(200).json({
      ok: true,
      msg: "Item created successfully.",
      item: newItem,
    });
  } catch (error) {
    console.error("❌ Error in createItem:", error);
    res.status(500).json({
      ok: false,
      msg: "An error occurred while creating item or sending notifications.",
    });
  }
};

export default createItem;