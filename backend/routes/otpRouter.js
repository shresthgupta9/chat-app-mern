const express = require('express');
const router = express.Router();
const { body, header, validationResult } = require('express-validator');

const otpGenerateController = require("../controllers/otpGenerateController");

router.post(
    "/generate",
    [
        body("email")
            .exists()
            .notEmpty()
            .withMessage('Field is required')
            .isEmail()
            .withMessage("Please provide a valid email address")
            .normalizeEmail()
            .isLength({ max: 254 })
            .withMessage('Email address must not exceed 254 characters')
    ],
    (req, res, next) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        next();
    },
    otpGenerateController
)

module.exports = router;