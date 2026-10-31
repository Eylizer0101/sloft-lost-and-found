// SERVER/controllers/AdminController.js 
import Item from '../models/Item.js';
import User from '../models/User.js';
import Archive from '../models/Archive.js';
import Notification from "../models/Notification.js";
import ClaimNotification from '../models/ClaimNotification.js'; // ✅ ADD THIS IMPORT
import nodemailer from "nodemailer";
import emailTemplate from "../utils/emailTemplate.js";
import dotenv from "dotenv";
dotenv.config();

// ✅ Get dashboard statistics
export const getStats = async (req, res) => {
  try {
    const totalLost = await Item.countDocuments({ type: "Lost", status: { $ne: "Claimed" } });
    const totalFound = await Item.countDocuments({ type: "Found" });
    const claimedInItems = await Item.countDocuments({ status: "Claimed" });
    const claimedInArchive = await Archive.countDocuments({ status: "Claimed" });
    const totalClaimed = claimedInItems + claimedInArchive;

    // ✅ Count items that are still pending approval or action
    const pendingUnclaimed = await Item.countDocuments({ status: "Pending" });

    return res.status(200).json({
      ok: true,
      stats: { totalLost, totalFound, totalClaimed, pendingUnclaimed },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: "Server error" });
  }
};

// ✅ Get all items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('userId', 'fullname studentId email');
    return res.status(200).json({ ok: true, items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
};

// ✅ Simplified Update item status (no pending/approval flow)
// SERVER/controllers/AdminController.js - UPDATE ITEM STATUS FUNCTION ONLY
export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Claimed', 'Returned', 'Found', 'Lost'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, msg: 'Invalid status' });
    }

    const item = await Item.findByIdAndUpdate(id, { status }, { new: true })
      .populate('userId', 'fullname studentId email');
    if (!item) return res.status(404).json({ ok: false, msg: "Item not found" });

    if (status === "Claimed") {
      // ✅ DAGDAG: Hanapin ang claim notification para makuha ang claim by information
      const claimNotification = await ClaimNotification.findOne({ 
        itemId: id, 
        status: "Pending" 
      }).populate('userId', 'fullname studentId course contact');

      const archivedItem = new Archive({
        name: item.name,
        userId: item.userId,
        description: item.description,
        type: item.type,
        category: item.category,
        location: item.location,
        room: item.room,
        areaImage: item.areaImage,
        date: item.date,
        number: item.number,
        img: item.img,
        status: "Claimed",
        comments: item.comments,
        // ✅ DAGDAG: Isave ang claim by information
        claimedBy: claimNotification ? {
          userId: claimNotification.userId._id,
          fullname: claimNotification.userId.fullname,
          studentId: claimNotification.userId.studentId,
          course: claimNotification.userId.course,
          contact: claimNotification.userId.contact
        } : null
      });
      await archivedItem.save();
      await Item.findByIdAndDelete(id);

      // ✅ DAGDAG: Update claim notification status to Claimed
      if (claimNotification) {
        await ClaimNotification.findByIdAndUpdate(
          claimNotification._id, 
          { status: "Claimed" }
        );
      }
    }

    const totalLost = await Item.countDocuments({ type: 'Lost', status: { $ne: 'Claimed' } });
    const totalFound = await Item.countDocuments({ type: 'Found' });
    const claimedInItems = await Item.countDocuments({ status: 'Claimed' });
    const claimedInArchive = await Archive.countDocuments({ status: 'Claimed' });
    const totalClaimed = claimedInItems + claimedInArchive;

    return res.status(200).json({
      ok: true,
      item,
      stats: { totalLost, totalFound, totalClaimed, pendingUnclaimed: 0 }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
};

// ✅ Simplified Mark as Found (no approval needed)
export const markAsFound = async (req, res) => { 
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate("userId", "fullname email");
    if (!item) return res.status(404).json({ ok: false, msg: "Item not found" });

    item.status = "Found";
    item.type = "Found";
    await item.save();

    if (item.userId?.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const html = emailTemplate(
        item.userId.fullname,
        item.name,
        "Found",
        item.description
      );

      await transporter.sendMail({
        from: `"S-LOFT Lost & Found" <${process.env.EMAIL_USER}>`,
        to: item.userId.email,
        subject: `Item Marked as Found: ${item.name}`,
        html,
      });
    }

    try {
      const users = await User.find({}, "_id");
      const message = `📢 The item "${item.name}" posted by ${item.userId.fullname} has been marked as FOUND.`;
      const notifications = users.map(user => ({
        userId: user._id,
        itemId: item._id,
        message,
        type: "ItemUpdate",
        isRead: false,
      }));
      await Notification.insertMany(notifications);
    } catch (notifError) {
      console.error("❌ Failed to send in-app notifications:", notifError);
    }

    const totalLost = await Item.countDocuments({ type: 'Lost', status: { $ne: 'Claimed' } });
    const totalFound = await Item.countDocuments({ type: 'Found' });
    const claimedInItems = await Item.countDocuments({ status: 'Claimed' });
    const claimedInArchive = await Archive.countDocuments({ status: 'Claimed' });
    const totalClaimed = claimedInItems + claimedInArchive;

    return res.status(200).json({
      ok: true,
      msg: "Item marked as Found and notifications sent!",
      item,
      stats: { totalLost, totalFound, totalClaimed, pendingUnclaimed: 0 },
    });
  } catch (error) {
    console.error("markAsFound error:", error);
    return res.status(500).json({ ok: false, msg: "Server error" });
  }
};

// ✅ Remaining functions unchanged below
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
};

export const deleteUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ ok: false, msg: 'User not found' });
    return res.status(200).json({ ok: true, msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
};

export const deleteItemAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ ok: false, msg: 'Item not found' });

    const archivedItem = new Archive({
      name: item.name,
      userId: item.userId,
      description: item.description,
      type: item.type,
      category: item.category,
      location: item.location,
      room: item.room,
      areaImage: item.areaImage,
      date: item.date,
      number: item.number,
      img: item.img,
      status: "Deleted",
      comments: item.comments
    });
    await archivedItem.save();

    await Item.findByIdAndDelete(id);
    return res.status(200).json({ ok: true, msg: 'Item moved to archive and deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
};

export const restoreArchivedItem = async (req, res) => {
  try {
    const { id } = req.params;
    const archivedItem = await Archive.findById(id);
    if (!archivedItem) return res.status(404).json({ ok: false, msg: "Archived item not found." });

    // ✅ FIX: Tanggalin ang status check para ma-restore kahit anong status
    // if (archivedItem.status.toLowerCase() !== "deleted") {
    //   return res.status(400).json({ ok: false, msg: "Only deleted items can be restored." });
    // }

    // ✅ FIX: Gamitin ang tamang status values based sa Item model
    let restoredStatus = "Approved"; // default status
    
    // ✅ Convert status from archive to valid Item status
    if (archivedItem.type === "Lost") {
      restoredStatus = "Approved"; // For lost items, set to Approved
    } else if (archivedItem.type === "Found") {
      restoredStatus = "Approved"; // For found items, set to Approved  
    }
    
    // ✅ If item was claimed before, keep it as claimed
    if (archivedItem.status === "Claimed") {
      restoredStatus = "Claimed";
    }

    const restoredItem = new Item({
      name: archivedItem.name,
      userId: archivedItem.userId,
      description: archivedItem.description,
      type: archivedItem.type,
      category: archivedItem.category,
      location: archivedItem.location,
      room: archivedItem.room,
      areaImage: archivedItem.areaImage,
      date: archivedItem.date,
      number: archivedItem.number,
      img: archivedItem.img,
      status: restoredStatus, // ✅ USE CORRECT STATUS
      comments: archivedItem.comments,
      // ✅ DAGDAG: Include claimedBy data if exists
      ...(archivedItem.claimedBy && { claimedBy: archivedItem.claimedBy })
    });

    await restoredItem.save();
    await Archive.findByIdAndDelete(id);

    return res.status(200).json({
      ok: true,
      msg: "Item restored successfully.",
      restoredItem,
    });
  } catch (error) {
    console.error("Error restoring item:", error);
    return res.status(500).json({ ok: false, msg: "Server error while restoring item." });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter object
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day
      
      dateFilter = {
        createdAt: {
          $gte: start,
          $lte: end
        }
      };
    }

    const totalReports = await Item.countDocuments(dateFilter);
    const totalUsers = await User.countDocuments(dateFilter);
    
    // User registration analytics with date filter
    const userRegistrations = await User.aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    // Monthly data for items AND users with date filter
    const monthlyData = await Promise.all(months.map(async (month, i) => {
      const start = new Date(new Date().getFullYear(), i, 1);
      const end = new Date(new Date().getFullYear(), i + 1, 1);
      
      // Apply custom date filter if provided
      let monthFilter = { createdAt: { $gte: start, $lt: end } };
      if (startDate && endDate) {
        const customStart = new Date(startDate);
        const customEnd = new Date(endDate);
        customEnd.setHours(23, 59, 59, 999);
        
        // Only include month if it falls within custom date range
        if (start < customEnd && end > customStart) {
          monthFilter = { 
            createdAt: { 
              $gte: new Date(Math.max(start.getTime(), customStart.getTime())),
              $lt: new Date(Math.min(end.getTime(), customEnd.getTime()))
            }
          };
        } else {
          return { month, lost: 0, found: 0, users: 0 };
        }
      }

      const lost = await Item.countDocuments({ 
        type: 'Lost', 
        ...monthFilter
      });
      const found = await Item.countDocuments({ 
        type: 'Found', 
        ...monthFilter
      });
      const users = await User.countDocuments(monthFilter);
      return { month, lost, found, users };
    }));

    // ✅ FIXED: Get pending claims from ClaimNotification with PROPER date filter
    const pendingClaims = await ClaimNotification.countDocuments({ 
      status: 'Pending',
      ...dateFilter
    });
    
    const claimedInItems = await Item.countDocuments({ 
      status: 'Claimed',
      ...dateFilter 
    });
    const claimedInArchive = await Archive.countDocuments({ 
      status: 'Claimed',
      ...dateFilter
    });
    const claimed = claimedInItems + claimedInArchive;

    // User role distribution with date filter
    const userRoles = await User.aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // User course distribution with date filter
    const usersByCourse = await User.aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: "$course",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const categoryAggregation = await Item.aggregate([
      {
        $match: dateFilter
      },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categories = categoryAggregation.map(c => ({
      category: c._id || "Uncategorized",
      count: c.count,
    }));

    // ✅ FIXED: Calculate percentages correctly
    const totalStatus = pendingClaims + claimed;
    const statusPercent = {
      pending: totalStatus > 0 ? Math.round((pendingClaims / totalStatus) * 100) : 0,
      claimed: totalStatus > 0 ? Math.round((claimed / totalStatus) * 100) : 0,
    };

    // Recent user registrations (last 7 days) - respect custom date filter
    let recentRegistrationsFilter = {
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    };
    
    if (startDate && endDate) {
      recentRegistrationsFilter = dateFilter;
    }
    
    const recentRegistrations = await User.countDocuments(recentRegistrationsFilter);

    // Verified vs unverified users with date filter
    const verifiedUsers = await User.countDocuments({ 
      isVerified: true,
      ...dateFilter 
    });
    const unverifiedUsers = await User.countDocuments({ 
      isVerified: false,
      ...dateFilter 
    });

    res.status(200).json({
      ok: true,
      totalReports,
      totalUsers,
      recentRegistrations,
      verifiedUsers,
      unverifiedUsers,
      monthlyData,
      statusSummary: { 
        pending: pendingClaims, 
        claimed, 
        percentage: statusPercent 
      },
      categorySummary: categories,
      userRoles,
      usersByCourse,
      userRegistrations,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ ok: false, msg: "Error generating analytics" });
  }
};

// ✅ ADD THIS FUNCTION TO AdminController.js - PERMANENT DELETE
export const permanentDeleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from Archive collection PERMANENTLY
    const deletedArchive = await Archive.findByIdAndDelete(id);
    
    if (!deletedArchive) {
      return res.status(404).json({ ok: false, msg: "Archived item not found" });
    }

    res.status(200).json({ 
      ok: true,
      msg: "Item permanently deleted successfully",
      deletedItem: deletedArchive 
    });
    
  } catch (error) {
    console.error("Error permanently deleting item:", error);
    res.status(500).json({ ok: false, msg: "Server error", error: error.message });
  }
};