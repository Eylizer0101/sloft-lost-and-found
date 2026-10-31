import User from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const secretKey = process.env.JWT_SECRET;

const generateJWT = async (id) => {
    const token = jwt.sign({ id }, secretKey, {
        expiresIn: '24h',
    })
    return token
}

const createUser = async (req, res) => {
    try {
        const { fullname, studentId, email, password, course, yearLevel } = req.body; // ✅ Added yearLevel

        let imagePath = undefined;
        if (req.file) {
            imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(200).json({
                ok: false,
                msg: 'The email is already used',
            });
        }

        const findStudent = await User.findOne({ studentId });
        if (findStudent) {
            return res.status(200).json({
                ok: false,
                msg: 'The Student ID is already used',
            });
        }

        const newUser = new User({
            fullname,
            studentId,
            course,
            yearLevel, // ✅ Added
            email,
            password,
            img: imagePath,
            isVerified: true // Registration no longer requires email OTP
        });

        const salt = bcrypt.genSaltSync();
        newUser.password = bcrypt.hashSync(password, salt);

        const token = await generateJWT(newUser.id);
        await newUser.save();

        return res.status(201).json({
            ok: true,
            msg: 'User created successfully. You can now log in.',
            token,
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                studentId: newUser.studentId,
                course: newUser.course,
                yearLevel: newUser.yearLevel, // ✅ Added
                email: newUser.email,
                img: newUser.img
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'An error occurred, contact an administrator',
        });
    }
}

export default createUser;
