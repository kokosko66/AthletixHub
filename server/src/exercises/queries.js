const getExercises = 'SELECT * FROM Exercises';
const getExercisesById = 'SELECT * FROM Exercises WHERE id = ?';
const getExerciseByName = 'SELECT * FROM Exercises WHERE name = ?';

const addExercise = 'INSERT INTO Exercises (name, repetitions) VALUES (?, ?)';
const updateExercise = 'UPDATE Exercises SET name = ?, repetitions = ?';
const deleteExercise = 'DELETE FROM users WHERE id = ?';

export const queries = {
    getExercises,
    getExercisesById,
    getExerciseByName,
    addExercise,
    updateExercise,
    deleteExercise,
};