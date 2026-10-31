// server/controllers/Items/getArchivedItems.js
import Item from '../../models/Item.js'

const getArchivedItems = async (req, res) => {
    try {
        console.log("🔄 Fetching archived items..."); // ✅ ADD FOR DEBUGGING
        
        const items = await Item.find({ isArchived: true })
            .populate('userId', 'fullname studentId img')
            .sort({ createdAt: -1 });

        console.log("📦 Archived items found:", items.length); // ✅ ADD FOR DEBUGGING
        console.log("🔍 Archived items:", items); // ✅ ADD FOR DEBUGGING

        return res.status(200).json({
            ok: true,
            items: items
        });
    
    } catch (error) {
        console.log("❌ Error fetching archived items:", error)
        return res.status(500).json({
            ok: false,
            msg: 'An error occurred while fetching archived items',
        })
    } 
} 

export default getArchivedItems