import Item from '../../models/Item.js';
import Archive from '../../models/Archive.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js'; // ✅ ADDED for notifications
import nodemailer from 'nodemailer';
import emailTemplate from '../../utils/emailTemplate.js'; // ✅ HTML template for email

const updateItem = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    // ✅ Update images kung may na-upload
    if (req.files && req.files.length > 0) {
      newData.img = req.files.map(file => `uploads/${file.filename}`);
    }

    const itemUpdated = await Item.findOneAndUpdate({ _id: id }, newData, {
      new: true,
    });

    // ✅ If status is "Claimed", move item to Archive
    if (itemUpdated && itemUpdated.status === "Claimed") {
      const archivedItem = new Archive({
        name: itemUpdated.name,
        userId: itemUpdated.userId,
        description: itemUpdated.description,
        type: itemUpdated.type,
        category: itemUpdated.category,
        location: itemUpdated.location,
        room: itemUpdated.room,
        areaImage: itemUpdated.areaImage,
        date: itemUpdated.date,
        number: itemUpdated.number,
        img: itemUpdated.img,
        status: itemUpdated.status,
        comments: itemUpdated.comments
      });
      await archivedItem.save();
      await Item.findByIdAndDelete(id);
    }

    // ✅ Recalculate stats (Claimed includes Archive)
    const totalLost = await Item.countDocuments({ type: 'Lost', status: { $ne: 'Claimed' } });
    const totalFound = await Item.countDocuments({ type: 'Found' });
    const claimedInItems = await Item.countDocuments({ status: 'Claimed' });
    const claimedInArchive = await Archive.countDocuments({ status: 'Claimed' });
    const totalClaimed = claimedInItems + claimedInArchive;
    const pendingUnclaimed = await Item.countDocuments({ status: 'Pending' });

    // ✅ Send Email Notification to user
    if (itemUpdated) {
      const user = await User.findById(itemUpdated.userId);
      if (user && user.email) {
        try {
          // ✅ Gmail SMTP setup (REAL EMAIL)
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER, // your Gmail
              pass: process.env.EMAIL_PASS, // your App Password
            },
          });

          // Email content
          const htmlMessage = emailTemplate(
            user.name,
            itemUpdated.name,
            itemUpdated.status,
            itemUpdated.description
          );

          await transporter.sendMail({
            from: `"S-LOFT Lost & Found" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Item Status Updated: ${itemUpdated.name}`,
            html: htmlMessage,
          });

          console.log(`📩 Email notification sent to ${user.email}`);
        } catch (emailError) {
          console.error("❌ Email sending failed:", emailError);
        }
      }

      // ✅ NEW: Create in-app notification record
      try {
        const message = `Your item "${itemUpdated.name}" has been updated to "${itemUpdated.status}".`;
        await Notification.create({
          userId: itemUpdated.userId,
          itemId: itemUpdated._id,
          message,
          type: "ItemUpdate", // ✅ IDINAGDAG: Notification type
          isRead: false,
        });
        console.log(`🔔 Notification created for user: ${itemUpdated.userId}`);
      } catch (notifError) {
        console.error("❌ Failed to create notification:", notifError);
      }

      return res.status(201).json({
        ok: true,
        msg: 'Item Updated!',
        itemUpdated,
        stats: { totalLost, totalFound, totalClaimed, pendingUnclaimed }
      });
    } else {
      return res.status(404).json({ msg: "Item doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: 'An error occurred, contact an administrator',
    });
  }
};

export default updateItem;