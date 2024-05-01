const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || "rahasia";

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Ambil token dari header Authorization: Bearer <token>

    if (!token) {
        return res.status(403).json({ message: "Token diperlukan" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token tidak valid" });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;