import Item from '../../models/Item.js';

const addComment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.id; // ✅ instead of req.user.id

    if (!text) return res.status(400).json({ ok: false, msg: "Comment text required" });

    try {
        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ ok: false, msg: "Item not found" });

        // ✅ Add comment with date
        const newComment = { userId, text, date: new Date() };
        item.comments.push(newComment);
        await item.save();

        // ✅ Populate user info when returning comments
        const populatedItem = await Item.findById(id).populate({
            path: 'comments.userId',
            select: '_id nickname fullname img email studentId'
        });

        res.status(200).json({ ok: true, msg: "Comment added", comments: populatedItem.comments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: "Server error" });
    }
};

export default addComment;
