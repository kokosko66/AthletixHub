import { queries } from "./queries.js";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "ATHLETIXHUB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const getMessagesByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;

    const [rows] = await pool.query(queries.getMessagesByRequestId, [
      requestId,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(queries.getMessagesByUserId, [
      userId,
      userId,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching user messages:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(queries.getConversations, [
      userId,
      userId,
      userId,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { workoutRequestId, senderId, recipientId, messageText } = req.body;
    const sentAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Verify this is a valid workout request and the users are part of it
    const [requestCheck] = await pool.query(
      `SELECT * FROM WorkoutRequests
             WHERE id = ? AND status = 'accepted'
             AND (trainee_id = ? OR trainer_id = ?)
             AND (trainee_id = ? OR trainer_id = ?)`,
      [workoutRequestId, senderId, senderId, recipientId, recipientId],
    );

    if (requestCheck.length === 0) {
      return res.status(403).json({
        message:
          "You don't have permission to send messages for this workout request or it hasn't been accepted yet",
      });
    }

    await pool.query(queries.addMessage, [
      workoutRequestId,
      senderId,
      recipientId,
      messageText,
      sentAt,
    ]);

    // Return the newly created message with sender information
    const [newMessage] = await pool.query(
      `SELECT cm.*,
                    s.name AS sender_name, s.family_name AS sender_family_name,
                    r.name AS recipient_name, r.family_name AS recipient_family_name
             FROM ChatMessages cm
             JOIN Users s ON cm.sender_id = s.id
             JOIN Users r ON cm.recipient_id = r.id
             WHERE cm.workout_request_id = ? AND cm.sender_id = ? AND cm.sent_at = ?`,
      [workoutRequestId, senderId, sentAt],
    );

    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { requestId, userId } = req.params;
    const readAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Verify user has permission to mark these messages as read
    const [requestCheck] = await pool.query(
      `SELECT * FROM WorkoutRequests
             WHERE id = ? AND (trainee_id = ? OR trainer_id = ?)`,
      [requestId, userId, userId],
    );

    if (requestCheck.length === 0) {
      return res.status(403).json({
        message:
          "You don't have permission to mark messages for this workout request",
      });
    }

    await pool.query(queries.markMessagesAsRead, [readAt, requestId, userId]);

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: error.message });
  }
};
