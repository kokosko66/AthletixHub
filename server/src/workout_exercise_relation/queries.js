const wholeWorkoutInfo = 'SELECT w.id AS workout_id, w.name AS workout_name, e.id AS exercise_id, e.name AS exercise_name, e.repetitions FROM Workouts w JOIN WorkoutExercises we ON w.id = we.workout_id JOIN Exercises e ON we.exercise_id = e.id;'

const userWorkoutInfo = `
    SELECT w.id AS workout_id, w.name AS workout_name, 
           e.id AS exercise_id, e.name AS exercise_name, e.repetitions 
    FROM Workouts w 
    JOIN WorkoutExercises we ON w.id = we.workout_id 
    JOIN Exercises e ON we.exercise_id = e.id
    JOIN UserWorkouts uw ON w.id = uw.workout_id
    WHERE uw.user_id = ?
`;

export const queries = {
    wholeWorkoutInfo,
    userWorkoutInfo
};