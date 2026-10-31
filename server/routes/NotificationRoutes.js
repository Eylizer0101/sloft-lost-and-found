import express from "express";
import createNotification from "../controllers/Notifications/createNotification.js";
import getNotifications from "../controllers/Notifications/getNotifications.js";
import markAsRead from "../controllers/Notifications/markAsRead.js";

const router = express.Router();

// Create new notification
router.post("/", createNotification);

// Get all notifications by user
router.get("/:userId", getNotifications);

// Mark as read
router.put("/read/:id", markAsRead);

export default router;
