import mongoose from "mongoose";

const ItemsSchema = new mongoose.Schema({
    name: { type: String, default: 'No Name' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: 'Without description' },
    type: { type: String, enum: ['Lost', 'Found'], required: true },
    category: { 
        type: String, 
        enum: ['Electronics','Clothes','Books','Accessories','Documents','Shoes','Sports','Others'], 
        default: 'Others' 
    },
   
    room: { 
        type: String, 
        enum: [
            'Room 101',
            'Room 201',
            'Room 202', 
            'Room 203 - CL1',
            'Room 204 - CL2',
            'Room 208',
            'Room 209',
            'Room 301',
            'Room 302',
            'Room 304',
            'Room 305',
            'Room 306',
            'Room 307',
            'Room 308',
            'Room 309',
            'Room 401',
            'Room 402',
            'Room 403',
            'Room 404',
            'Room 405',
            'Room 406 - CL3',
            'Room 407 - CL4',
            'Room 408',
            'Room 409',
            'Library',
            'Canteen',
            'Entrance'
        ],
        default: 'Room 101'
    },

    date: { type: String, required: true },
    number: { type: String, required: true },
    img: [{
        type: String,
        default: 'https://i.ibb.co/DpZ3qy2/Untitled-design-10.png',
    }],

    // ✅ UPDATED: default is now "Approved"
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Claimed', 'Returned', 'Found'],
      default: 'Approved' // ✅ Auto approved na
    },

    // ✅ ADD: New field for user archive system
    isArchived: {
        type: Boolean,
        default: false
    },

   // ✅ COMMENT WITH DATE
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            text: { type: String, required: true },
            date: { type: Date, default: Date.now }, // ✅ Automatically stores comment date
        }
    ],
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Item = mongoose.model('Item', ItemsSchema);
export default Item;