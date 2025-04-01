import express from "express";
import {
  getMessagesByRequestId,
  getMessagesByUserId,
  getConversations,
  addMessage,
  markMessagesAsRead,
} from "./controller.js";

const router = express.Router();

router.get("/chat/messages/request/:requestId", getMessagesByRequestId);
router.get("/chat/messages/user/:userId", getMessagesByUserId);
router.get("/chat/conversations/:userId", getConversations);
router.post("/chat/messages", addMessage);
router.put("/chat/messages/read/:requestId/:userId", markMessagesAsRead);

export default router;
