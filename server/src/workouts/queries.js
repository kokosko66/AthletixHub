const getWorkouts = 'SELECT * FROM Workouts';
const getWorkoutById = 'SELECT * FROM Workouts WHERE id = ?';
const getWorkoutByName = 'SELECT * FROM Workouts WHERE name = ?';

const addWorkout = 'INSERT INTO Workouts (name, created_at) VALUES (?, ?)';
const updateWorkout = 'UPDATE Workouts SET name = ? WHERE id = ?';
const deleteWorkout = 'DELETE FROM Workouts WHERE id = ?';

const queries = {
    getWorkouts,
    getWorkoutById,
    getWorkoutByName,
    addWorkout,
    updateWorkout,
    deleteWorkout,
};

export { queries };