const getUserWorkouts = 'SELECT * FROM UserWorkouts';
const getUserWorkoutById = 'SELECT * WHERE user_id = ? AND workout_id = ?';

const addUserWorkout = 'INSERT INTO UserWorkouts (user_id, workout_id) VALUES (?, ?)';
const updateUserWorkout = 'UPDATE UserWorkouts SET user_id = ?, workout_id = ? WHERE user_id = ? AND workout_id = ?';
const deleteUserWorkout = 'DELETE FROM UserWorkouts WHERE user_id = ? AND workout_id = ?';

export const queries = {
    getUserWorkouts,
    getUserWorkoutById,
    addUserWorkout,
    updateUserWorkout,
    deleteUserWorkout,
};