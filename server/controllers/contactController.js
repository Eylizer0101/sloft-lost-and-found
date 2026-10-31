import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    // Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Gmail account
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // Email details
    const mailOptions = {
      from: `"Lost & Found Contact" <${process.env.EMAIL_USER}>`,
      to: "eyma.deafria.au@phinmaed.com", // where you want to receive messages
      subject: `📩 New Message from ${name}`,
      html: `
        <h3>You received a new message from your Lost & Found Contact Form</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, msg: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, msg: "Failed to send message" });
  }
};
