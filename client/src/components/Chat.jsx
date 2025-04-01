import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Chat.css";

const Chat = ({ currentUser, workoutRequest }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const otherUserId =
    currentUser.id === workoutRequest.trainee_id
      ? workoutRequest.trainer_id
      : workoutRequest.trainee_id;

  const otherUserName =
    currentUser.id === workoutRequest.trainee_id
      ? `${workoutRequest.trainer_name} ${workoutRequest.trainer_family_name}`
      : `${workoutRequest.trainee_name} ${workoutRequest.trainee_family_name}`;

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/chat/messages/request/${workoutRequest.id}`,
        );
        setMessages(response.data);
        setLoading(false);

        // Mark messages as read
        await axios.put(
          `http://localhost:3000/api/chat/messages/read/${workoutRequest.id}/${currentUser.id}`,
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    if (workoutRequest.id) {
      fetchMessages();

      // Set up polling to get new messages every 10 seconds
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [workoutRequest.id, currentUser.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const messageData = {
        workoutRequestId: workoutRequest.id,
        senderId: currentUser.id,
        recipientId: otherUserId,
        messageText: newMessage,
      };

      const response = await axios.post(
        "http://localhost:3000/api/chat/messages",
        messageData,
      );

      // Add the new message to the messages array
      setMessages([...messages, response.data]);

      // Clear the input field
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};

    messages.forEach((message) => {
      const date = formatDate(message.sent_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat with {otherUserName}</h3>
      </div>

      <div className="chat-messages">
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date} className="message-date-group">
            <div className="message-date-divider">
              <span>{date}</span>
            </div>

            {msgs.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender_id === currentUser.id ? "message-sent" : "message-received"}`}
              >
                <div className="message-content">
                  <p>{message.message_text}</p>
                  <span className="message-time">
                    {formatTime(message.sent_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
