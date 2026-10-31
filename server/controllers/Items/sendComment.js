// SERVER/controllers/Items/sendComment.js
import Item from "../../models/Item.js";
import nodemailer from "nodemailer";

export const sendComment = async (req, res) => {
  const { itemId } = req.params;
  const { comment } = req.body;

  try {
    const item = await Item.findById(itemId).populate("userId");
    if (!item) return res.status(404).json({ ok: false, msg: "Item not found" });

    if (!item.userId.email)
      return res.status(400).json({ ok: false, msg: "User has no email" });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"S-LOFT Lost & Found" <${process.env.EMAIL_USER}>`,
      to: item.userId.email,
      subject: `Comment regarding item "${item.name}"`,
      text: comment,
    });

    res.json({ ok: true, msg: "Comment email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Failed to send comment email" });
  }
};
