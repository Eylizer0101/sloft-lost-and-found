// ✅ CONSISTENT VERSION
import express from "express";
import {
  getStats,
  getItems,
  updateItemStatus,
  deleteItemAdmin,
  markAsFound,
  getAllUsers,
  deleteUserAdmin,
  restoreArchivedItem,
   permanentDeleteItem
} from "../controllers/AdminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { validateJWT } from "../middlewares/validateToken.js";
import Archive from "../models/Archive.js";
import { getAnalytics } from "../controllers/AdminController.js";

const router = express.Router();

// ✅ ROUTES
router.get('/stats', validateJWT, isAdmin, getStats);
router.get('/items', validateJWT, isAdmin, getItems);
router.put('/items/:id/status', validateJWT, isAdmin, updateItemStatus);
router.put('/items/:id/found', validateJWT, isAdmin, markAsFound);
router.delete('/items/:id', validateJWT, isAdmin, deleteItemAdmin);

router.get('/users', validateJWT, isAdmin, getAllUsers);
router.delete('/users/:id', validateJWT, isAdmin, deleteUserAdmin);

// ✅ RESTORE & PERMANENT DELETE ROUTES - GAMITIN NATIN ITO
router.put('/archive/:id/restore', validateJWT, isAdmin, restoreArchivedItem);
router.delete('/archive/:id/permanent', validateJWT, isAdmin, permanentDeleteItem);

// ADD THIS ROUTE
router.get('/analytics', validateJWT, isAdmin, getAnalytics);

// ✅ ARCHIVE ROUTES
router.get("/archive", async (req, res) => {
  try {
    const archives = await Archive.find()
      .populate("userId", "fullname studentId email course img")
      .sort({ createdAt: -1 });
    res.status(200).json({ ok: true, archives });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error fetching archives" });
  }
});

router.get("/archive/:id", async (req, res) => {
  try {
    const archive = await Archive.findById(req.params.id)
      .populate("userId", "fullname studentId email course img");
    if (!archive) return res.status(404).json({ ok: false, msg: "Archived item not found" });
    res.status(200).json({ ok: true, archive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error fetching archive details" });
  }
});

export default router;