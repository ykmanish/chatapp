const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ fullName, email, password });
    res.status(201).json({ _id: user._id, fullName: user.fullName, email: user.email, avatar: user.avatar, about: user.about, token: generateToken(user._id) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    user.isOnline = true;
    await user.save();
    res.json({ _id: user._id, fullName: user.fullName, email: user.email, avatar: user.avatar, about: user.about, isOnline: user.isOnline, friends: user.friends, token: generateToken(user._id) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.fullName = req.body.fullName || user.fullName;
    user.about = req.body.about || user.about;
    if (req.body.avatar) user.avatar = req.body.avatar;
    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, fullName: updatedUser.fullName, email: updatedUser.email, avatar: updatedUser.avatar, about: updatedUser.about });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { register, login, updateProfile };