import crypto from "node:crypto";
import fs from "node:fs/promises";

// backend/controllers/Items/createItem.js
import Item from "../../models/Item.js";
import User from "../../models/User.js";
import Notification from "../../models/Notification.js";
import  sendEmailNotification  from "../../utils/sendEmailNotification.js";

// Optional durable image storage. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY
// and CLOUDINARY_API_SECRET on Render. Existing disk uploads still work locally.
const storeImages = async (files = []) => {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!files.length) return [];
  if (!cloud || !key || !secret) return files.map((file) => `uploads/${file.filename}`);

  const urls = [];
  for (const file of files) {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "sloft_items";
    const signature = crypto.createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
    const form = new FormData();
    form.append("file", new Blob([await fs.readFile(file.path)], { type: file.mimetype }), file.originalname);
    form.append("api_key", key);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/upload`, { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Image cloud upload failed");
    urls.push(result.secure_url);
    await fs.unlink(file.path).catch(() => {});
  }
  return urls;
};

const createItem = async (req, res) => {
  try {
    const itemData = req.body;
    const savedImages = await storeImages(req.files || []);

    // ✅ Create new item (auto-approved na)
    const newItem = new Item({
      ...itemData,
      status: "Pending", // ✅ Directly approved instead of pending
      category: itemData.category || "Others",
      areaImage: itemData.areaImage || "",
      img: savedImages,
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