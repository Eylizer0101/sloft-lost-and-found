// SERVER/controllers/Claims/getPendingClaimsCount.js
import ClaimNotification from "../../models/ClaimNotification.js";

const getPendingClaimsCount = async (req, res) => {
  try {
    console.log("🔄 Counting pending claims...");
    
    // Extract date filter from query parameters
    const { startDate, endDate } = req.query;
    
    // Build date filter object
    let dateFilter = { status: "Pending" };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day
      
      dateFilter.createdAt = {
        $gte: start,
        $lte: end
      };
    }
    
    console.log("📅 Date filter for pending claims:", dateFilter);

    // Check if ClaimNotification model exists
    if (!ClaimNotification) {
      console.error("❌ ClaimNotification model is undefined!");
      return res.status(500).json({ 
        ok: false, 
        msg: "ClaimNotification model not found",
        count: 0 
      });
    }
    
    // Test database connection first
    const dbConnection = ClaimNotification.db.readyState;
    console.log(`📊 MongoDB connection state: ${dbConnection}`);
    
    if (dbConnection !== 1) {
      console.error("❌ MongoDB not connected!");
      return res.status(500).json({ 
        ok: false, 
        msg: "Database not connected",
        count: 0 
      });
    }
    
    const count = await ClaimNotification.countDocuments(dateFilter);
    
    console.log(`📊 Pending claims count: ${count}`);
    
    return res.status(200).json({ 
      ok: true, 
      count,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (error) {
    console.error("❌ Error counting pending claims:", error);
    console.error("❌ Error details:", error.message);
    
    res.status(500).json({ 
      ok: false, 
      msg: "Server error counting pending claims: " + error.message,
      count: 0 
    });
  }
};

export default getPendingClaimsCount;