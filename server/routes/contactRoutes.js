import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

// POST /contact/send
router.post("/send", sendContactMessage);

export default router;
