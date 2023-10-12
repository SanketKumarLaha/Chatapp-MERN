import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

const requireAuth = async (req, res, next) => { 
  const { authorization } = req.headers;

  if (!authorization) {
    throw Error("Not authorized");
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default requireAuth;
