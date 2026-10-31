// SERVER/controllers/Items/getItemById.js
import Item from '../../models/Item.js';

const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findOne({ _id: id })
            .populate({
                path: 'userId',
                select: '_id fullname img email studentId course yearLevel contact' // ✅ fixed fields
            })
            .populate({
                path: 'comments.userId',
                select: '_id fullname img email studentId course yearLevel contact' // ✅ same fix for comments
            });

        if (item) {
            return res.status(200).json({ item, ok: true, msg: 'Item found' });
        } else {
            return res.status(204).json({ ok: false, msg: 'Item not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(404).json({ ok: false, msg: 'An error occurred, contact admin' });
    }
};

export default getItemById;
