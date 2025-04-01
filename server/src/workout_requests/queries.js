const getWorkoutRequests = "SELECT * FROM WorkoutRequests";
const getWorkoutRequestById = "SELECT * FROM WorkoutRequests WHERE id = ?";
const getWorkoutRequestsByTrainerId =
  "SELECT wr.*, u.name as trainee_name, u.family_name as trainee_family_name FROM WorkoutRequests wr JOIN Users u ON wr.trainee_id = u.id WHERE wr.trainer_id = ?";
const getWorkoutRequestsByTraineeId =
  "SELECT wr.*, u.name as trainer_name, u.family_name as trainer_family_name FROM WorkoutRequests wr JOIN Users u ON wr.trainer_id = u.id WHERE wr.trainee_id = ?";
const getPendingWorkoutRequestsByTrainerId =
  'SELECT wr.*, u.name as trainee_name, u.family_name as trainee_family_name FROM WorkoutRequests wr JOIN Users u ON wr.trainee_id = u.id WHERE wr.trainer_id = ? AND wr.status = "pending"';

const addWorkoutRequest =
  "INSERT INTO WorkoutRequests (trainee_id, trainer_id, status, created_at) VALUES (?, ?, ?, ?)";
const updateWorkoutRequestStatus =
  "UPDATE WorkoutRequests SET status = ?, updated_at = ? WHERE id = ?";
const deleteWorkoutRequest = "DELETE FROM WorkoutRequests WHERE id = ?";

export const queries = {
  getWorkoutRequests,
  getWorkoutRequestById,
  getWorkoutRequestsByTrainerId,
  getWorkoutRequestsByTraineeId,
  getPendingWorkoutRequestsByTrainerId,
  addWorkoutRequest,
  updateWorkoutRequestStatus,
  deleteWorkoutRequest,
};
