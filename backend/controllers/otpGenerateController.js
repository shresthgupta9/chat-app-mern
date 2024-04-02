const bcrypt = require('bcrypt');

const asyncErrorHandler = require('../utils/asyncErrorHandler');
const { generateJWT } = require('../utils/jwtHandler');
const sendMail = require('../utils/emailSender');

const otpGenerateController = asyncErrorHandler(async (req, res, next) => {
    const email = req.body.email;

    const otp = Math.floor(100000 + Math.random() * 900000);

    sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP",
        text: `Your OTP is ${otp}`,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(`${otp}`, salt);

    const token = generateJWT({ hashedOtp, email });

    return res.status(200).json({
        message: "OTP sent successfully",
        data: {
            token: token,
        },
    });
});

module.exports = otpGenerateController;


