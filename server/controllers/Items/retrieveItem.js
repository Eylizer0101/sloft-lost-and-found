// server/controllers/Items/retrieveItem.js
import Item from '../../models/Item.js'

const retrieveItem = async (req, res) => {
    const { id } = req.params      
    
    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ ok: false, msg: "Item not found" });
        }

        // ✅ RETRIEVE ITEM - ibalik sa hindi archived
        item.isArchived = false;
        await item.save();

        return res.status(200).json({ 
            ok: true, 
            msg: 'Item retrieved successfully',
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

export default retrieveItem