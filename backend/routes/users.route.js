import express from "express";

const router = express.Router();

// Controller
import {
  allUsers,
  loginUser,
  registerUser,
  logoutUser,
} from "../controller/user.controller.js";
import authorized from "../middleware/authorizeMiddleware.js";

router.route("/").post(registerUser).get(authorized, allUsers);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;
