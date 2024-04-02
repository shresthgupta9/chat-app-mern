const jwt = require("jsonwebtoken");

const generateJWT = (data, expiresIn = "10m") => {
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: expiresIn });
    return token;
};

const parseToken = (req) => {
    const token = req.headers.authorization.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateJWT, parseToken };
