// workout_id INT,
// exercise_id INT,
// PRIMARY KEY (workout_id, exercise_id),
// FOREIGN KEY (workout_id) REFERENCES Workouts(id) ON DELETE CASCADE,
// FOREIGN KEY (exercise_id) REFERENCES Exercises(id) ON DELETE CASCADE

const getWorkoutExercises = 'SELECT * FROM WorkoutExercises';
const getWorkoutExerciseById = 'SELECT * FROM WorkoutExercises WHERE workout_id = ? AND exercise_id = ?';

const addWorkoutExercise = 'INSERT INTO WorkoutExercises (workout_id, exercise_id) VALUES (?, ?)';
const updateWorkoutExercise = 'UPDATE WorkoutExercises SET workout_id = ?, exercise_id = ? WHERE workout_id = ? AND exercise_id = ?';
const deleteWorkoutExercise = 'DELETE FROM WorkoutExercises WHERE workout_id = ? AND exercise_id = ?';

export const queries = {
    getWorkoutExercises,
    getWorkoutExerciseById,
    addWorkoutExercise,
    updateWorkoutExercise,
    deleteWorkoutExercise,
};