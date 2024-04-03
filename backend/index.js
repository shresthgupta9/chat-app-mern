require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const ws = require("ws");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT;

const Message = require("./models/MessageModel");

const errController = require('./controllers/errorController');

const otpRouter = require("./routes/otpRouter");
const userRouter = require("./routes/userRouter");
const messageRouter = require("./routes/messageRouter");

app.use(express.json());
app.use(require('cors')());

app.use("/otp", otpRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

app.all('*', (req, res, next) => {
    return res.status(404).json({ message: `Can't find ${req.url} on the server`, data: {} });
});

app.use(errController);

async function main() {
    await mongoose.connect(process.env.MDBURL);
    const server = app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log(`Test on http://localhost:${PORT}/`);
    });

    const wsServer = new ws.WebSocketServer({ server });

    wsServer.on('connection', (connection, req) => {

        function notifyAboutOnlineUser() {
            [...wsServer.clients].forEach((client) => {
                const userArray = [];

                [...wsServer.clients].map((connection) => {
                    const user = {
                        userId: connection.userId,
                        name: connection.name
                    }
                    userArray.push(user);
                })

                client.send(JSON.stringify({
                    online: userArray
                }))
            })
        }

        try {
            connection.isAlive = true;

            connection.timer = setInterval(() => {
                connection.ping();
                connection.deathTimer = setTimeout(() => {
                    connection.isAlive = false;
                    clearInterval(connection.timer);
                    connection.terminate();
                    notifyAboutOnlineUser();
                    console.log("dead");
                }, 1000);
            }, 5000);

            connection.on("pong", () => {
                clearTimeout(connection.deathTimer);
            });

            const authorization = req.headers["sec-websocket-protocol"];
            const token = authorization.split(" ")[1];
            const user = jwt.verify(token, process.env.JWT_SECRET);
            const { userId, name } = user;
            connection.userId = userId;
            connection.name = name;

            connection.on('message', async (message) => {
                const msgData = JSON.parse(message.toString());
                const { recipient, text } = msgData;
                if (recipient && text) {
                    const messageData = await Message.create({
                        sender: connection.userId,
                        recipient,
                        text,
                    });
                    [...wsServer.clients]
                        .filter(client => client.userId === recipient)
                        .forEach((client) => {
                            client.send(JSON.stringify({
                                text,
                                sender: connection.userId,
                                recipient,
                                _id: messageData._id,
                            }))
                        });
                }
            });
            notifyAboutOnlineUser();
        }
        catch (error) {
            console.log(error);
        }
    })
}

main();