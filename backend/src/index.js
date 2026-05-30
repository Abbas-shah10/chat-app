import express, { urlencoded } from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import path from 'path'

// Utils
import connectDb from "../db/db.js";
import userRoutes from "../routes/users.route.js";
import chatRoutes from "../routes/chat.route.js";
import messageRoutes from "../routes/message.route.js";

dotenv.config();
connectDb();
const PORT = process.env.PORT || 8000;

const app = express();

// middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));



app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);

// ----------- Deployment -----------------------
const __dirname1 = path.resolve()
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/frontend/build')))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve((__dirname1, 'frontend', "build", 'index.html')))
  })

} else {
  app.get('/', (req, res) => {
    res.send("API is running successfully")
  })
}

// ----------- Deployment -----------------------




const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connect to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.off("setup", () => {
    console.log("user disconnected")
    socket.leave(userData._id)
  })
});

server.listen(PORT, () => {
  console.log(`app is running on server port ${PORT}`);
});
