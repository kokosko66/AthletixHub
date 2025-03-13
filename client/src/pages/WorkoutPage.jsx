import NavBar from '../components/NavBar';
import '../styles/WorkoutPage.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Dialog from '../components/Dialog';

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState('');
    const [exercises, setExercises] = useState([{ name: '', repetitions: '' }]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/workout_exercise_relation')
            .then((response) => {
                const groupedWorkouts = groupExercisesByWorkout(response.data);
                setWorkouts(groupedWorkouts);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const groupExercisesByWorkout = (data) => {
        const workoutMap = new Map();

        data.forEach(({ workout_id, workout_name, exercise_id, exercise_name, repetitions }) => {
            if (!workoutMap.has(workout_id)) {
                workoutMap.set(workout_id, {
                    id: workout_id,
                    name: workout_name,
                    exercises: []
                });
            }

            workoutMap.get(workout_id).exercises.push({
                id: exercise_id,
                name: exercise_name,
                repetitions: repetitions
            });
        });

        return Array.from(workoutMap.values());
    };

    const addExerciseField = () => {
        setExercises([...exercises, { name: '', repetitions: '' }]);
    };

    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = [...exercises];
        updatedExercises[index][field] = value;
        setExercises(updatedExercises);
    };

    const createWorkout = () => {
        const newWorkout = {
            name: newWorkoutName,
            exercises
        };

        axios.post('http://localhost:3000/api/workouts', newWorkout)
            .then(() => {
                setIsDialogOpen(false);
                setNewWorkoutName('');
                setExercises([{ name: '', repetitions: '' }]);
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="page-container">
            <NavBar />

            <div className="create-workout-section">
                
                <button className="create-workout-button" onClick={() => setIsDialogOpen(true)}>
                    Create Workout
                </button>
                <h3>These are example workouts, showing our variety of exercises</h3>
            </div>

            <div className="workouts-container">
                {workouts.map((workout) => (
                    <div className="workout-item" key={workout.id}>
                        <h3>{workout.name}</h3>
                        <ul className="exercise-list">
                            {workout.exercises.map((exercise) => (
                                <li key={exercise.id}>
                                    {exercise.name} - {exercise.repetitions} reps
                                </li>
                            ))}
                        </ul>
                        <button className="select-workout-button">Select Workout</button>
                    </div>
                ))}
            </div>

            <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <div className="dialog-container">
                    <h2 className="dialog-title">Create a New Workout</h2>
                    
                    <input
                        type="text"
                        className="dialog-input"
                        placeholder="Workout Name"
                        value={newWorkoutName}
                        onChange={(e) => setNewWorkoutName(e.target.value)}
                    />

                    <h3 className="dialog-subtitle">Exercises:</h3>
                    {exercises.map((exercise, index) => (
                        <div key={index} className="exercise-input-group">
                            <input
                                type="text"
                                className="dialog-input"
                                placeholder="Exercise Name"
                                value={exercise.name}
                                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                            />
                            <input
                                type="number"
                                className="dialog-input"
                                placeholder="Repetitions"
                                value={exercise.repetitions}
                                onChange={(e) => handleExerciseChange(index, 'repetitions', e.target.value)}
                            />
                        </div>
                    ))}

                    <div className="dialog-buttons">
                        <button className="dialog-button add-exercise" onClick={addExerciseField}>
                            Add Exercise
                        </button>
                        <button className="dialog-button create-workout" onClick={createWorkout}>
                            Create Workout
                        </button>
                    </div>
                </div>
            </Dialog>   

        </div>
    );
}
