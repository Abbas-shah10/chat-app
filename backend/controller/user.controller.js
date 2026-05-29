import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/generateToken.js";

const hashRefreshToken = (refreshToken) => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

const createTokenResponse = async (user) => {
  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = hashRefreshToken(refreshToken);
  await user.save();

  return {
    message: "Authentication successful",
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: accessToken,
    accessToken,
    refreshToken,
  };
};

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });

  if (user) {
    const tokenResponse = await createTokenResponse(user);
    return res.status(201).json(tokenResponse);
  } else {
    return res.status(400).json({ message: "Failed to create User" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const tokenResponse = await createTokenResponse(user);
  return res.status(200).json(tokenResponse);
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const currentRefreshTokenHash = hashRefreshToken(refreshToken);
    if (user.refreshToken !== currentRefreshTokenHash) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id,
    );
    user.refreshToken = hashRefreshToken(newRefreshToken);
    await user.save();

    return res.status(200).json({
      token: accessToken,
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const logoutUser = async (req, res) => {
  if (req.user) {
    req.user.loggedOutAt = new Date();
    req.user.refreshToken = null;
    await req.user.save();
  }

  return res.status(200).json({ message: "User Logout Successfully " });
};

const allUsers = async (req, res) => {
  const keyword = req.query
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  return res.send(users);
};

export { registerUser, loginUser, refreshAccessToken, allUsers, logoutUser };
