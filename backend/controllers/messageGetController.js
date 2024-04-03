const Message = require("../models/MessageModel");

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { parseToken } = require("../utils/jwtHandler");

const messageGetController = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.id;

    const userData = parseToken(req);
    const myUserId = userData.userId;

    const messages = await Message.find({
        sender: { $in: [userId, myUserId] },
        recipient: { $in: [userId, myUserId] }
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages)
})

module.exports = messageGetController;
