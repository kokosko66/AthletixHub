// server/src/chat_messages/queries.js

const getMessagesByRequestId = `
    SELECT cm.*,
           s.name AS sender_name, s.family_name AS sender_family_name,
           r.name AS recipient_name, r.family_name AS recipient_family_name
    FROM ChatMessages cm
    JOIN Users s ON cm.sender_id = s.id
    JOIN Users r ON cm.recipient_id = r.id
    WHERE cm.workout_request_id = ?
    ORDER BY cm.sent_at ASC
`;

const getMessagesByUserId = `
    SELECT cm.*,
           s.name AS sender_name, s.family_name AS sender_family_name,
           r.name AS recipient_name, r.family_name AS recipient_family_name,
           wr.status AS request_status
    FROM ChatMessages cm
    JOIN Users s ON cm.sender_id = s.id
    JOIN Users r ON cm.recipient_id = r.id
    JOIN WorkoutRequests wr ON cm.workout_request_id = wr.id
    WHERE (cm.sender_id = ? OR cm.recipient_id = ?) AND wr.status = 'accepted'
    ORDER BY cm.sent_at DESC
`;

const getConversations = `
    SELECT
        wr.id AS workout_request_id,
        wr.trainee_id,
        wr.trainer_id,
        trainee.name AS trainee_name,
        trainee.family_name AS trainee_family_name,
        trainer.name AS trainer_name,
        trainer.family_name AS trainer_family_name,
        (
            SELECT sent_at
            FROM ChatMessages
            WHERE workout_request_id = wr.id
            ORDER BY sent_at DESC
            LIMIT 1
        ) AS last_message_time,
        (
            SELECT COUNT(*)
            FROM ChatMessages
            WHERE workout_request_id = wr.id
            AND recipient_id = ?
            AND read_at IS NULL
        ) AS unread_count
    FROM WorkoutRequests wr
    JOIN Users trainee ON wr.trainee_id = trainee.id
    JOIN Users trainer ON wr.trainer_id = trainer.id
    WHERE (wr.trainee_id = ? OR wr.trainer_id = ?) AND wr.status = 'accepted'
    GROUP BY wr.id
    ORDER BY last_message_time DESC
`;

const addMessage = `
    INSERT INTO ChatMessages
    (workout_request_id, sender_id, recipient_id, message_text, sent_at)
    VALUES (?, ?, ?, ?, ?)
`;

const markMessagesAsRead = `
    UPDATE ChatMessages
    SET read_at = ?
    WHERE workout_request_id = ? AND recipient_id = ? AND read_at IS NULL
`;

export const queries = {
  getMessagesByRequestId,
  getMessagesByUserId,
  getConversations,
  addMessage,
  markMessagesAsRead,
};
