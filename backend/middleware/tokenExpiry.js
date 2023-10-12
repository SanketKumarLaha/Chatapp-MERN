import jwt from "jsonwebtoken";

const tokenExpiry = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw Error("No authorization headers");
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const timeStamp = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < timeStamp) {
      return res.status(404).json({ message: "Token expired" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default tokenExpiry;
