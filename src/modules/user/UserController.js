const User = require('../../models/user');
const Order = require('../../models/order');
const bcrypt = require('bcryptjs');
const responseMsg = require('../../helpers/responseMessage');
const axios = require('axios');
const multer = require('multer')
const path = require('path')

exports.verifyEmail = async (req, res) => {
    try {
        let { token, cb } = req.params;
        console.log(token);
        let now = new Date();
        let user = await User.findOne({verifyToken: token});
        if (!user) {
            console.log('Verify Email link is invalid');
            res.send('Verify Email link is invalid');
        }
        if (now > user.verifyTokenExpiry) {
            console.log('Verify Email link has expired')
            res.send('Verify Email link has expired');
        }
        await user.updateOne({
            verified: true,
            verifyTokenExpiry: now
        });
        const string = encodeURIComponent('verified');
        res.redirect("https://localhost:3000/login" + string );
        // res.status(200).send('Email verified');
        // res.end();
    } catch (error) {
        res.send(error);
    }
}

// RESET PASSWORD
exports.checkTokenReset = async (req, res) => {
    try {
        let { token } = req.params;
        let now = new Date();
        let user = await User.findOne({resetPasswordToken: token});
        if (!user) {
            console.log('Password reset link is invalid');
            res.send('Password reset link is invalid');
        }
        if (now > user.resetPasswordTokenExpiry) {
            console.log('Password reset link has expired')
            res.send('Password reset link has expired');
        }
        res.status(200).send({
            user: user.username,
            message: 'Password reset link ok'
        });
    } catch (error) {
        throw error;
    }
}
exports.resetPassword = async (req, res) => {
    try {
        let { token } = req.params;
        let now = new Date();
        let user = await User.findOne({resetPasswordToken: token});
        if (!user) {
            console.log('Password reset link is invalid');
            res.send('Password reset link is invalid');
        }
        if (now > user.resetPasswordTokenExpiry) {
            console.log('Password reset link has expired')
            res.send('Password reset link has expired');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await user.updateOne({
            password: hashedPassword,
            resetPasswordTokenExpiry: now
        });
        res.status(200).send({
            message: 'Password Updated'
        })
    } catch (error) {
        throw error;
    }
}

exports.uploadResi = async(req, res) => {
    const storage = multer.diskStorage({
        destination: "./public/uploads",
        filename: function(req, file, cb) {
            cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
        }
    })

    const upload = multer({
        storage: storage,
        limits: {fileSize: 1000000},
    }).single("myImage");

    upload(req, res, async(err) => {
        let order = await Order.findOne({code: req.body.code});
        await order.updateOne({
            transferName: req.body.name,
            transferImage: req.file.filename,
            status: "Menunggu Konfirmasi Admin"
        });
        if(!err)
            return res.json({
                code: 200,
                status: 'OK'
            })
        else 
            throw err
    })
}

exports.uploadResi2 = async(req, res) => {
    const storage = multer.diskStorage({
        destination: "./public/uploads",
        filename: function(req, file, cb) {
            cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
        }
    })

    const upload = multer({
        storage: storage,
        limits: {fileSize: 1000000},
    }).single("myImage");

    upload(req, res, async(err) => {
        let order = await Order.findOne({code: req.body.code});
        console.log(req.file);
        if(req.file) {
            await order.updateOne({
                transferName: req.body.name,
                transferImage: req.file.filename
            });
        } else {
            await order.updateOne({
                transferName: req.body.name,
            });
        }
        if(!err)
            return res.json({
                code: 200,
                status: 'OK'
            })
        else 
            throw err
    })
}