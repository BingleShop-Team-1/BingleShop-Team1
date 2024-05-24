const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const secretKey = process.env.JWT_SECRET_KEY;

// Konfigurasi transporter Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});


const userRegister = async (req, res) => {
    const { name, password, email, is_admin, address } = req.body;

    if (!email || !password || !name) {
        return res.status(400).send({
            message: "Silakan isikan Email, Password, dan Nama Lengkap"
        });
    }

    try {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).send({
                message: "Email telah digunakan"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

        const user = await User.create({
            name,
            email,
            is_admin,
            address,
            password: hashedPassword,
            is_verified: false,
            verification_token: verificationToken
        });

        const verificationLink = `http://localhost:3002/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `<p>Hi ${name},</p><p>Please verify your email by clicking on the following link: <a href="${verificationLink}">${verificationLink}</a></p>`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).send({
            message: "Pengguna berhasil didaftarkan"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Terjadi kesalahan saat mendaftarkan pengguna"
        });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const payload = jwt.verify(token, secretKey);
        const user = await User.findOne({ where: { email: payload.email, verification_token: token } });

        if (!user) {
            return res.status(400).send({ message: "Token verifikasi tidak valid." });
        }

        user.is_verified = true;
        user.verification_token = null;
        await user.save();

        return res.redirect('http://localhost:3000/verification-success');

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Terjadi kesalahan saat verifikasi email."
        });
    }
};



const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    // Jika Email dan Password kosong
    if (!email || !password) {
        return res.status(400).send({
            message: "Silakan isikan Email & Password"
        });
    }
    // Jika Email tidak ada di database
    else if (!user) {
        return res.status(401).send({
            message: "Email tidak ditemukan"
        });
    }
    // Jika Email dan Password valid, dan Email ditemukan
    else {
        try {
            const passwordMatch = await bcrypt.compare(password, user.password)
            // Login Berhasil
            if (passwordMatch) {
                const token = jwt.sign(
                    { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin }, 
                    secretKey, 
                    { expiresIn: '1h' })
                return res.status(200).json({
                    message: "Login berhasil",
                    token
                });
                //Jika Password salah
            } else {
                return res.status(401).send({
                    message: "Kombinasi Email dan Password salah!"
                });
            }
        } catch (error) {
            return res.status(500).send({
                message: "Terjadi kesalahan"
            });
        };
    };
}

const userUpdate = async (req, res) => {
    const id = req.params.id;
    const { name, address, email, oldPassword, newPassword, isAdmin } = req.body;

    // Temukan pengguna berdasarkan ID
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).send({
            message: "Pengguna tidak ditemukan"
        });
    }

    // Periksa apakah oldPassword diberikan user?
    if (oldPassword == null || oldPassword == "") {
        return res.status(401).send({
            message: "silakan masukkan Old Password"
        });
    }

    // Verifikasi Old Password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
        return res.status(401).send({
            message: "Old Password salah!"
        });
    }

    // Enkripsi newPassword jika diberikan
    let hashedNewPassword;
    if (newPassword) {
        hashedNewPassword = await bcrypt.hash(newPassword, 10);
    }

    // Update informasi pengguna
    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.is_admin = isAdmin || user.is_admin;
    if (hashedNewPassword) {
        user.password = hashedNewPassword
    }
    // Simpan perubahan user ke database
    await user.save();
    return res.status(204).send()
}

const userDelete = async (req, res) => {
    const id = req.params.id;
    const { password } = req.body;

    // Temukan pengguna berdasarkan ID
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).send({ message: "Pengguna tidak ditemukan" });
    }

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send({ message: "Password yang Anda masukkan salah" });
    }

    // Hapus pengguna dari database
    try {
        await User.destroy({
            where: {
                id: id
            }
        });
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error saat menghapus user:", error);
        return res.sendStatus(500);
    }
}

const whoAmI = (req, res) => {
   if (!req.user) {
        return res.status(401).send({ message: "Unauthorized - No user data found in token." });
    }

    // Kembalikan data user yang relevan
    const { name, email, is_admin } = req.user;
    return res.status(200).json({ name, email, is_admin });
};

module.exports = {
    userRegister,
    getUsers,
    userLogin,
    userUpdate,
    userDelete,
    whoAmI,
    verifyEmail,
}