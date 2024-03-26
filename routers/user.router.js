const router = require('express').Router();
const { User } = require('..models');  // Pastikan path model Item sudah sesuai



// Route untuk melakukan pendaftaran user
router.post("/register", async (req, res) => {
    const { name, password, email, address } = req.body;
    
    // Cari apakah Username atau Email sudah ada di database
    const existingEmail = await User.findOne({ where: { email } });

    // Enkripsi Password
    hashedPassword = await bcrypt.hash(password, 10);

    // Jika Username & Password tidak diisi
    if (!email || !password || !name ) {
        return res.status(400).send({ 
            message: "Silakan isikan Email, Password, dan Nama Lengkap"
        });
    }
    // Jika Email telah digunakan
    else if (existingEmail){
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
        user.address = address
        user.password = hashedPassword

        // Simpan pengguna baru ke dalam database
        await user.save();

        return res.status(201).send({ 
            message: "Pengguna berhasil didaftarkan"
        });
    };
});



// Route mengambil semua data user dari database
router.get('/', (req, res) => getList(req, res, User))



// Route untuk melakukan login user
router.post("/login", async (req,res) => {
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
            const passwordMatch = await bcrypt.compare(password,user.password)
            // Login Berhasil
            if (passwordMatch) {
                return res.status(200).send({
                    message: "Login berhasil"
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
});



// Route untuk melakukan update info user
router.put('/:id'), async (req, res) => {
    const id = req.params.id;
    const { name, address, email, odlPassword, newPassword } = req.body;
    
    // Temukan pengguna berdasarkan ID
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).send({
            message: "Pengguna tidak ditemukan"
        });
    }

    // Periksa apakah oldPassword diberikan user?
    if(odlPassword) {
        return res.status(401).send({
            message: "silakan masukkan Old Password"
        });
    }

    // Verifikasi Old Password
    const passwordMatch = await bcrypt.compare(odlPassword, user.password);
    if(!passwordMatch) {
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



// Route untuk melakukan delete akun user, memerlukan password
router.delete('/:id', async (req, res) => {
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
});