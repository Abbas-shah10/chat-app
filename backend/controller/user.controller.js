import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    res.status(400).json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });

  if (user) {
    res.status(201).json({
      message: "User created successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
    await user.save();
  } else {
    res.status(400).json({ message: "Failed to create User" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.status(200).json({
        message: "User Logged in successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(400).json({ message: "InValid Password" });
  }
};

const logoutUser = async (req, res) => {
  if (req.user) {
    req.user.loggedOutAt = new Date();
    await req.user.save();
  }

  res.status(200).json({ message: "User Logout Successfully " });
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

  res.send(users);
};

export { registerUser, loginUser, allUsers, logoutUser };
