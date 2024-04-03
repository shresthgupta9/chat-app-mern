const User = require("../models/userModel");

const asyncErrorHandler = require("../utils/asyncErrorHandler");

const userGetAllController = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find({}, { "_id": 1, name: 1 });

    return res.status(200).json(users);
});

module.exports = userGetAllController;