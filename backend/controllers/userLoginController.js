const bcrypt = require('bcrypt');

const User = require('../models/userModel');

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require('../utils/customError');
const { generateJWT } = require('../utils/jwtHandler');

const userLoginController = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        const err = new CustomError("Invalid Email or Password", 404);
        return next(err);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const err = new CustomError("Invalid Email or Password", 404);
        return next(err);
    }

    const token = generateJWT({ userId: user._id }, 5 * 60 * 60) // 5 hr login time

    return res.status(200).json({ message: "Logged in successfully", data: { token } })
})

module.exports = userLoginController;