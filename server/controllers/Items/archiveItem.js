// server/controllers/Items/archiveItem.js
import Item from '../../models/Item.js' 

const archiveItem = async (req, res) => {
    const { id } = req.params      
    
    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ ok: false, msg: "Item not found" });
        }

        // ✅ GUMAMIT NG BAGONG FIELD INSTEAD OF STATUS
        item.isArchived = true;
        await item.save();

        return res.status(200).json({ 
            ok: true, 
            msg: 'Item moved to archive successfully',
            item: item 
        })
    
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            ok: false,
            msg: 'An error occurred, contact with admin',
        })
    } 
} 

export default archiveItem