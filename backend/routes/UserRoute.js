import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import tokenExpiry from "../middleware/tokenExpiry.js";
import {
  allUsers,
  getUser,
  login,
  signup,
  updateUserInfo,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

//protecting routes
router.use(tokenExpiry);
router.use(requireAuth);

router.get("/allUsers", allUsers);

router.post("/getUser", getUser);

router.patch("/updateUserInfo", updateUserInfo);

export default router;
