import User from '../../models/User.js';  
import crypto from 'crypto';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Brevo setup
const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'No user found with this email' });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // ✅ Send email via Brevo using frontend URL from .env
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


    const sendSmtpEmail = {
  sender: {
    name: process.env.BREVO_FROM_NAME,
    email: process.env.BREVO_FROM_EMAIL
  },
  to: [{ email }],
  subject: "S-Loft Lost and Found | Reset Your Password",
  htmlContent: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
      <h2 style="color: #2e86de; text-align: center;">Hello ${user.fullname},</h2>
      <p>We received a request to reset your password for your <b>PHINMA AU Lost & Found (S-Loft)</b> account.</p>
      <p>To proceed, please click the button below to reset your password. This link will remain valid for <b>1 hour</b> only.</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}" style="display:inline-block; padding:12px 25px; background:#2e86de; color:#fff; font-weight:bold; text-decoration:none; border-radius:6px;">Reset Password</a>
      </div>
      <p>If you did not request this, you can safely ignore this email. Your account will remain secure.</p>
      <br/>
      <hr style="border:none; border-top:1px solid #ccc; margin: 25px 0;">
      <p style="text-align:center; color:#555; font-size:14px;">
        — <b>${process.env.BREVO_FROM_NAME}</b><br/>
        <span style="font-size:13px;">S-Loft | PHINMA Araullo University Lost & Found System</span>
      </p>
    </div>
  `
};


    await transEmailApi.sendTransacEmail(sendSmtpEmail);

    return res.status(200).json({ ok: true, msg: 'Password reset email sent.' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: 'Server error, try again later.' });
  }
};
