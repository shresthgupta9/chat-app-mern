const express = require('express');
const router = express.Router();

const messageGetController = require("../controllers/messageGetController");

router.get("/:id", messageGetController);

module.exports = router;