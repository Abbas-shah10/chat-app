import express from "express";

// utils
import authorized from "../middleware/authorizeMiddleware.js";
import { allMessages, sendMessage } from "../controller/message.controller.js";

const router = express.Router();

router.route("/").post(authorized, sendMessage);
router.route("/:chatId").get(authorized, allMessages);

export default router;
