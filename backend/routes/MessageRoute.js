import express from "express";

import requireAuth from "../middleware/requireAuth.js";
import tokenExpiry from "../middleware/tokenExpiry.js";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/MessageController.js";

const router = express.Router();

//protecting routes
router.use(tokenExpiry);
router.use(requireAuth);

router.post("/sendMessage", sendMessage);

router.post("/getMessages", getMessages);

router.get("/getConversations", getConversations);

export default router;
