const express = require('express');
const router = express.Router();
const { body, header, validationResult } = require('express-validator');

const userRegisterController = require('../controllers/userRegisterController');
const userLoginController = require('../controllers/userLoginController');

router.post(
    "/register",
    [
        body("name")
            .exists()
            .notEmpty()
            .withMessage('Name is required'),

        body("password")
            .exists()
            .notEmpty()
            .withMessage('Password is required')
    ],
    (req, res, next) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        next();
    },
    userRegisterController
)

router.post(
    "/login",
    [
        body("email")
            .exists()
            .notEmpty()
            .withMessage('Field is required')
            .isEmail()
            .withMessage("Please provide a valid email address")
            .normalizeEmail()
            .isLength({ max: 254 })
            .withMessage('Email address must not exceed 254 characters'),
        body("password")
            .exists()
            .notEmpty()
            .withMessage('Password is required')
    ],
    (req, res, next) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        next();
    },
    userLoginController
)

module.exports = router;