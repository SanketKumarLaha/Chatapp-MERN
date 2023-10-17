import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

export const signup = async (req, res) => {
  try {
    const { username, email, password, imageUrl } = req.body;

    const response = await Users.signup({
      username,
      email,
      password,
      profilePic: imageUrl,
    });

    const token = createToken(response._id);

    res.status(200).json({ newUser: response, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await Users.login({
      email,
      password,
    });

    const token = createToken(response._id);

    res.status(200).json({ newUser: response, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const allUsers = async (req, res) => {
  try {
    const { _id } = req.user;

    const response = await Users.find({ _id: { $ne: _id } });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const response = await Users.findOne({ _id: userId });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { _id } = req.user;
    const updatedData = req.body;

    const response = await Users.findByIdAndUpdate({ _id: _id }, updatedData, {
      new: true,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
