import express from 'express';
import multer from 'multer';
import path from 'path';

import createUser from '../controllers/User/CreateUser.js';
import { loginUser } from '../controllers/User/LoginUser.js';
import { renewToken } from '../controllers/User/renewToken.js';
import { updateUser } from '../controllers/User/UpdateUser.js';
import { validateJWT } from '../middlewares/validateToken.js';
import { forgotPassword } from '../controllers/User/forgotPassword.js';
import { resetPassword } from '../controllers/User/resetPassword.js';
import { getUserById } from '../controllers/User/getUserById.js'; // ✅ ADD THIS

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/create', upload.single('img'), createUser);
router.put('/update/:id', validateJWT, upload.single('img'), updateUser);
router.post('/login', loginUser);
router.post('/renew', validateJWT, renewToken);

// ✅ Forgot password routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/:id', getUserById); // ✅ Add GET route for fetching user details


export default router;
