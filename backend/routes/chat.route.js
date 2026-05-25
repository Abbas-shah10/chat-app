import express from "express";

const router = express.Router();

import {
  accessChat,
  createGroupChat,
  fetchChats,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from "../controller/chat.controller.js";
import authorized from "../middleware/authorizeMiddleware.js";

router.route("/").post(authorized, accessChat);
router.route("/").get(authorized, fetchChats);
router.route("/group").post(authorized, createGroupChat);
router.route("/rename").patch(authorized, renameGroup);
router.route("/group-add").post(authorized, addToGroup);
router.route("/group-remove").put(authorized, removeFromGroup);

export default router;
