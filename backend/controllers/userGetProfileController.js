const User = require("../models/userModel");

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const { parseToken } = require("../utils/jwtHandler");

const userGetProfileController = asyncErrorHandler(async (req, res, next) => {
    const { userId } = parseToken(req);

    if (!userId) {
        const err = new CustomError("Invalid token", 400);
        return next(err);
    }

    const user = await User.findById(userId);

    if (!user) {
        const err = new CustomError("No user found", 404);
        return next(err);
    }

    return res.status(200).json({ message: "profile fetched successfully", data: { name: user.name, userId: user._id } })
});

module.exports = userGetProfileController;