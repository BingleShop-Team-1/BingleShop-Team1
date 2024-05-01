const { User } = require('../models')
const bcrypt = require('bcrypt')

const userRegister = async (req, res) => {
    const { name, password, email, is_admin, address } = req.body;

    // Cari apakah Username atau Email sudah ada di database
    const existingEmail = await User.findOne({ where: { email } });

    // Enkripsi Password
    hashedPassword = await bcrypt.hash(password, 10);

    // Jika Username & Password tidak diisi
    if (!email || !password || !name) {
        return res.status(400).send({
            message: "Silakan isikan Email, Password, dan Nama Lengkap"
        });
    }
    // Jika Email telah digunakan
    else if (existingEmail) {
        return res.send({
            message: "Email telah digunakan"
        });
    }
    // Register berhasil
    else {
        // Buat instance baru dari model User
        const user = new User
        user.name = name
        user.email = email
        user.is_admin = is_admin
        user.address = address
        user.password = hashedPassword

        // Simpan pengguna baru ke dalam database
        await user.save();

        return res.status(201).send({
            message: "Pengguna berhasil didaftarkan"
        });
    };
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
                    { name: user.name, email: user.email, is_admin: user.is_admin }, 
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
    const { name, address, email, oldPassword, newPassword } = req.body;

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
    userDelete
}