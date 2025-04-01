import React, { useState, useEffect } from "react";
import axios from "axios";
import Conversations from "./Conversations";
import Chat from "./Chat";
import "../styles/ChatPage.css";

const ChatPage = ({ currentUser }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [fullWorkoutRequest, setFullWorkoutRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  // When a conversation is selected, fetch the full workout request data
  useEffect(() => {
    const fetchWorkoutRequest = async () => {
      if (!selectedConversation) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/workout_requests/id/${selectedConversation.workout_request_id}`,
        );
        setFullWorkoutRequest({
          ...response.data,
          trainee_name: selectedConversation.trainee_name,
          trainee_family_name: selectedConversation.trainee_family_name,
          trainer_name: selectedConversation.trainer_name,
          trainer_family_name: selectedConversation.trainer_family_name,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workout request:", error);
        setLoading(false);
      }
    };

    if (selectedConversation) {
      fetchWorkoutRequest();
    }
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <Conversations
          currentUser={currentUser}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div className="chat-main">
        {loading ? (
          <div className="chat-loading">
            <div className="loading-spinner"></div>
            <p>Loading conversation...</p>
          </div>
        ) : fullWorkoutRequest ? (
          <Chat currentUser={currentUser} workoutRequest={fullWorkoutRequest} />
        ) : (
          <div className="chat-empty">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
