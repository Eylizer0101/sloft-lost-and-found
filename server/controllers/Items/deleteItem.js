import Item from '../../models/Item.js' 
import Archive from '../../models/Archive.js' // ✅ ADD THIS

const deleteItem = async (req, res) => {
    
    const { id } = req.params      
    
    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ ok: false, msg: "Item not found" });
        }

        // ✅ SAVE TO ARCHIVE BEFORE DELETE
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
            status: "Deleted", // ✅ Mark as deleted in archive
            comments: item.comments
        });
        await archivedItem.save();

        await Item.findByIdAndDelete({ _id: id });

        return res.status(200).json({ item, ok: true, msg: 'Item moved to archive and deleted from active list' })
    
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            ok: false,
            msg: 'An error occurred, contact with admin',
        })
    } 
} 

export default deleteItem
