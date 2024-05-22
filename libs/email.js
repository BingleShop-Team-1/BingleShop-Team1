require("dotenv").config();
const nodemailer = require('nodemailer')

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dimm.pamm@gmail.com',
        pass: process.env.GOOGLE_SMTP_PASSWORD
    }

})


mailTransport.sendMail({
    from: 'dimm.pamm@gmail.com',
    to: "mojjitt0o@gmail.com",
    text: "test"

    
})


module.exports = mailTransport