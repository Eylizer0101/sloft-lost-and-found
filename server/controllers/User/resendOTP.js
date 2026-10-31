// SERVER/controllers/User/resendOTP.js
import User from '../../models/User.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ ok: false, msg: 'Email is required.' });
    }

    // Hanapin ang user base sa email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'User not found' });
    }

    // Check kung verified na
    if (user.isVerified) {
      return res.status(400).json({ ok: false, msg: 'Email is already verified.' });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send new OTP via email
    const sendSmtpEmail = {
      sender: { name: process.env.BREVO_FROM_NAME, email: process.env.BREVO_FROM_EMAIL },
      to: [{ email }],
      subject: "S-Loft Lost and Found | New Verification Code",
      htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #2e86de;">Hello ${user.fullname},</h2>
              <p>You requested a new verification code for your <b>S-Loft Lost and Found System</b> account.</p>
              <p>Please use the new verification code below:</p>
              <h1 style="color:#d35400; text-align:center;">${otp}</h1>
              <p style="text-align:center; font-size: 0.9em; color: #555;">
                  This code is valid for <b>5 minutes</b>. Please do not share it with anyone.
              </p>
              <br/>
              <p>— <b>${process.env.BREVO_FROM_NAME}</b></p>
          </div>
      `
    };

    await transEmailApi.sendTransacEmail(sendSmtpEmail);

    return res.status(200).json({ 
      ok: true, 
      msg: 'New OTP sent to your email.' 
    });

  } catch (error) {
    console.error('Error in resendOTP:', error);
    return res.status(500).json({ 
      ok: false, 
      msg: 'Server error. Please try again.' 
    });
  }
};