// SERVER/controllers/User/verifyOTP.js
import User from '../../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({ ok: false, msg: 'Email and OTP are required.' });
    }

    // Hanapin ang user base sa email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'User not found' });
    }

    // Check kung may OTP at kung expired
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ ok: false, msg: 'OTP not found or expired' });
    }

    // Expiration check
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ ok: false, msg: 'OTP has expired. Please request a new one.' });
    }

    // Compare OTP (convert both to string)
    if (String(user.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ ok: false, msg: 'Invalid OTP' });
    }

    // ✅ Kung tama ang OTP
    user.isVerified = true;
    user.otp = undefined; // burahin OTP after verification
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ ok: true, msg: 'Email verified successfully!' });

  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return res.status(500).json({ ok: false, msg: 'Server error. Please try again.' });
  }
};
