import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    studentId: {             
        type: String,
        required: true,
        unique: true,
    },
    course: {
        type: String,
        required: true,
    },
    yearLevel: {          // ✅ Added
        type: String,
        required: true,
    },
    contact: {           // ✅ Added contact (phone number)
        type: String,
        default: ""
    },
    address: {             // ✅ Added address field
        type: String,
        default: ""
    },
    img: {
        type: String,
        default:
            'https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png',
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema)
export default User
