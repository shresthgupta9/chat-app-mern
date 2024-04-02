require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT;

const otpRouter = require("./routes/otpRouter");
const userRouter = require("./routes/userRouter");

app.use(express.json());
app.use(require('cors')());

app.use("/otp", otpRouter);
app.use("/user", userRouter);

app.all('*', (req, res, next) => {
    return res.status(404).json({ message: `Can't find ${req.url} on the server`, data: {} })
});

async function main() {
    await mongoose.connect(process.env.MDBURL);
    const server = app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log(`Test on http://localhost:${PORT}/`);
    });

    
}

main();