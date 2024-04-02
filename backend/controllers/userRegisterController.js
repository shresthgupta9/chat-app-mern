const bcrypt = require('bcrypt');

const User = require('../models/userModel');

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require('../utils/customError');
const { generateJWT, parseToken } = require('../utils/jwtHandler');

const userRegisterController = asyncErrorHandler(async (req, res, next) => {
    const { name, password, email1 } = req.body;
    let otp = req.body.otp;
    const { email, hashedOtp } = parseToken(req);

    otp = parseInt(otp);
    const isOTPMatch = await bcrypt.compare(`${otp}`, hashedOtp);
    const isEmailMatch = email1 === email;
    if (!isOTPMatch || !isEmailMatch) {
        const err = new CustomError('Invalid OTP', 400);
        return next(err);
    }

    let user;

    user = await User.findOne({ email1 });
    if (user && user.password) {
        const err = new CustomError('User already exists', 400);
        return next(err);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!user) user = await User.create({ email, name, password: hashedPassword });

    user.password = undefined;

    const token = generateJWT({ id: user._id }, 5 * 60 * 60); // 5 hr token validity

    return res.status(200).json({
        message: "User info added successfully",
        data: { token }
    });
})

module.exports = userRegisterController;