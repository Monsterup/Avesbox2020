const nodemailer = require('nodemailer');
const responseMsg = require('../helpers/responseMessage');

exports.forgetPassword = async (email, token) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "yudhamanage@gmail.com",
            pass: "Randudongkal123"
        }
    });

    let info = await transporter.sendMail({
        from: `"${process.env.NAME_SENDER} 🐔" <${process.env.MAIL_SENDER}>`,
        to: `"${email}"`,
        subject: "Avesbox: Forget Password",
        text: `Forget Password`,
        html: `${responseMsg.sendResetPassword('https://avesbox.glitch.me/password-reset' , token)}`
    });

    return info;
}

exports.verifyEmail = async (email, token) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "yudhamanage@gmail.com",
            pass: "Randudongkal123"
        }
    });

    let info = await transporter.sendMail({
        from: `"${process.env.NAME_SENDER} 🐔" <${process.env.MAIL_SENDER}>`,
        to: `"${email}"`,
        subject: "Avesbox: Verify Email",
        text: `Verify Your Email`,
        html: `${responseMsg.sendVerifyEmail('http://localhost:8000/verify-email' , token, "https://localhost:8000")}`
    });

    return info;
}

exports.OTP = async (email, token) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "yudhamanage@gmail.com",
            pass: "Randudongkal123"
        }
    });

    let info = await transporter.sendMail({
        from: `"${process.env.NAME_SENDER} 🐔" <${process.env.MAIL_SENDER}>`,
        to: `"${email}"`,
        subject: "Avesbox: Change Email",
        text: `Change Your Email`,
        html: `${responseMsg.OTP(token, "https://localhost:8000")}`
    });

    return info;
}

exports.OTP2 = async (email, token) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "yudhamanage@gmail.com",
            pass: "Randudongkal123"
        }
    });

    let info = await transporter.sendMail({
        from: `"${process.env.NAME_SENDER} 🐔" <${process.env.MAIL_SENDER}>`,
        to: `"${email}"`,
        subject: "Avesbox: Change Password",
        text: `Change Your Password`,
        html: `${responseMsg.OTP(token, "https://localhost:8000")}`
    });

    return info;
}
