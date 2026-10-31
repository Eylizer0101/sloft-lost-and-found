// SERVER/controllers/User/resetPassword.js
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ ok: false, msg: 'Token is invalid or has expired' });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ ok: true, msg: 'Password has been reset successfully.' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: 'Server error, try again later.' });
  }
};
