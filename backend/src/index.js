import express, { urlencoded } from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

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
});

server.listen(PORT, () => {
  console.log(`app is running on server port ${PORT}`);
});
