import express, { urlencoded } from "express";
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

app.listen(PORT, () => {
  console.log(`app is running on server port ${PORT}`);
});
