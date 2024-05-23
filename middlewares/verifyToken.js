const jwt = require('jsonwebtoken');
const { User } = require('../models');
const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    const token = req.query.token;

    if (!token) {
        console.log("Token tidak disediakan.");
        return res.status(400).send({ message: "Token tidak disediakan." });
    }

    try {
        // Decode the base64 encoded token
        const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
        console.log(`Decoded token: ${decodedToken}`);
        const payload = jwt.verify(decodedToken, secretKey);
        console.log(`Token payload: ${JSON.stringify(payload)}`);

        const user = await User.findOne({ where: { email: payload.email, verification_token: decodedToken } });

        if (!user) {
            console.log("Token verifikasi tidak valid atau user tidak ditemukan.");
            return res.status(400).send({ message: "Token verifikasi tidak valid." });
        }

        // Update user verification status
        user.is_verified = true;
        user.verification_token = null; // Clear the verification token
        await user.save();

        console.log("User berhasil diverifikasi.");
        next(); // Proceed to the next middleware to render the success page
    } catch (error) {
        console.error("Error during verification:", error);
        return res.status(500).send({ message: "Terjadi kesalahan saat verifikasi email." });
    }
};

module.exports = verifyToken;
