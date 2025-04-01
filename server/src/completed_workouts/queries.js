const getCompletedWorkouts = "SELECT * FROM CompletedWorkouts";
const getCompletedWorkoutsByUserId = `
    SELECT cw.*, w.name as workout_name
    FROM CompletedWorkouts cw
    JOIN Workouts w ON cw.workout_id = w.id
    WHERE cw.user_id = ?
    ORDER BY cw.completed_date DESC
`;
const getCompletedWorkoutsByDate = `
    SELECT cw.*, w.name as workout_name
    FROM CompletedWorkouts cw
    JOIN Workouts w ON cw.workout_id = w.id
    WHERE cw.user_id = ? AND cw.completed_date = ?
`;
const getCompletedWorkoutsByDateRange = `
    SELECT cw.*, w.name as workout_name
    FROM CompletedWorkouts cw
    JOIN Workouts w ON cw.workout_id = w.id
    WHERE cw.user_id = ? AND cw.completed_date BETWEEN ? AND ?
    ORDER BY cw.completed_date
`;

const addCompletedWorkout =
  "INSERT INTO CompletedWorkouts (user_id, workout_id, completed_date, created_at) VALUES (?, ?, ?, ?)";
const deleteCompletedWorkout = "DELETE FROM CompletedWorkouts WHERE id = ?";
const deleteCompletedWorkoutByDetails =
  "DELETE FROM CompletedWorkouts WHERE user_id = ? AND workout_id = ? AND completed_date = ?";

export const queries = {
  getCompletedWorkouts,
  getCompletedWorkoutsByUserId,
  getCompletedWorkoutsByDate,
  getCompletedWorkoutsByDateRange,
  addCompletedWorkout,
  deleteCompletedWorkout,
  deleteCompletedWorkoutByDetails,
};
