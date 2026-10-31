import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const secretKey = process.env.JWT_SECRET

export const validateJWT = async (req, res, next) => {
    
    const authHeader = req.header('Authorization') || req.header('token');
    if (!authHeader) {
        return res.status(401).json({
            ok: false,
            msg: 'Access denied',
        });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    try {
        const payload = jwt.verify(token, secretKey);
        req.id = payload.id;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token not valid',
        });
    }
};

export default validateJWT;
