const getWorkouts = 'SELECT * FROM workouts';
const getWorkoutById = 'SELECT * FROM workouts WHERE id = $1';
const getWorkoutByName = 'SELECT * FROM workouts WHERE name = $1';

const addWorkout = 'INSERT INTO workouts (name, created_at) VALUES ($1, $2)';
const updateWorkout = 'UPDATE workouts SET name = $1 WHERE id = $2';
const deleteWorkout = 'DELETE FROM workouts WHERE id = $1';

const queries = {
    getWorkouts,
    getWorkoutById,
    getWorkoutByName,
    addWorkout,
    updateWorkout,
    deleteWorkout,
};

export { queries };