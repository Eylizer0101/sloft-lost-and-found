// SERVER/middlewares/isAdmin.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

export const isAdmin = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ ok: false, msg: 'Missing token' });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ ok: false, msg: 'Missing token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id) return res.status(401).json({ ok: false, msg: 'Invalid token' });

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ ok: false, msg: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ ok: false, msg: 'Admin only' });

    req.user = user;
    next();
  } catch (error) {
    console.error("isAdmin error:", error);
    return res.status(401).json({ ok: false, msg: 'Invalid token / not admin' });
  }
};
