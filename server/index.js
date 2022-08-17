const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socket = require('socket.io');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());


app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

mongoose
    .connect(process.env.MONGO_URl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connected succesfully');
    })
    .catch(err => {
        console.log(`Error: ${err}`);
    });

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    }
});

const onlineUsers = {};

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.sendBuffer = [];

    socket.on("add-user", (userId) => {
        onlineUsers[userId] = socket.id;
        io.emit('user-connetion', Object.keys(onlineUsers));
        console.log(`add-user ${socket.id}`, onlineUsers);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers[data.to];
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", { msg: data.message, time: data.time });
        }
    });
    socket.on("edit-user-profile", (userId) => {
        io.emit('update-user-profile', userId);
    });
    socket.on('disconnect', () => {
        const i = Object.keys(onlineUsers).find(key => {
            return onlineUsers[key] == socket.id;
        });
        delete onlineUsers[i];
        io.emit('user-connetion', Object.keys(onlineUsers));
        console.log(`User ${socket.id} diconnected`);
    });
});
