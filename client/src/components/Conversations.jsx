import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Conversations.css";

const Conversations = ({ currentUser, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/chat/conversations/${currentUser.id}`,
        );
        setConversations(response.data);
        setLoading(false);

        // Auto-select the first conversation if available
        if (response.data.length > 0 && !selectedId) {
          handleSelectConversation(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchConversations();

      // Poll for new conversations/messages every 30 seconds
      const interval = setInterval(fetchConversations, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser?.id]);

  const handleSelectConversation = (conversation) => {
    setSelectedId(conversation.workout_request_id);
    onSelectConversation(conversation);
  };

  const formatLastMessageTime = (time) => {
    if (!time) return "";

    const messageDate = new Date(time);
    const now = new Date();

    // If the message is from today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If the message is from this week, show day name
    const diff = (now - messageDate) / (1000 * 60 * 60 * 24);
    if (diff < 7) {
      return messageDate.toLocaleDateString([], { weekday: "short" });
    }

    // Otherwise show date
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const getOtherUserName = (conversation) => {
    if (currentUser.id === conversation.trainee_id) {
      return `${conversation.trainer_name} ${conversation.trainer_family_name}`;
    } else {
      return `${conversation.trainee_name} ${conversation.trainee_family_name}`;
    }
  };

  const getInitials = (conversation) => {
    if (currentUser.id === conversation.trainee_id) {
      return `${conversation.trainer_name.charAt(0)}${conversation.trainer_family_name ? conversation.trainer_family_name.charAt(0) : ""}`;
    } else {
      return `${conversation.trainee_name.charAt(0)}${conversation.trainee_family_name ? conversation.trainee_family_name.charAt(0) : ""}`;
    }
  };

  if (loading) {
    return (
      <div className="conversations-loading">
        <div className="loading-spinner"></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="conversations-empty">
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="conversations-container">
      <div className="conversations-header">
        <h3>Conversations</h3>
      </div>
      <div className="conversations-list">
        {conversations.map((conversation) => (
          <div
            key={conversation.workout_request_id}
            className={`conversation-item ${selectedId === conversation.workout_request_id ? "selected" : ""} ${conversation.unread_count > 0 ? "unread" : ""}`}
            onClick={() => handleSelectConversation(conversation)}
          >
            <div className="conversation-avatar">
              {getInitials(conversation)}
            </div>
            <div className="conversation-info">
              <div className="conversation-name-time">
                <h4>{getOtherUserName(conversation)}</h4>
                <span className="conversation-time">
                  {formatLastMessageTime(conversation.last_message_time)}
                </span>
              </div>
              {conversation.unread_count > 0 && (
                <div className="unread-badge">{conversation.unread_count}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conversations;
