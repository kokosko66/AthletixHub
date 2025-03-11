import NavBar from '../components/NavBar';
import '../styles/WorkoutPage.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TrainersPage() {

    const [workouts, setWorkouts] = useState([]);


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
    
    return(
        <div className="wokrouts-container">
            <NavBar />
            <div className='create-workout-button'>
                <button>Create Workout</button>
                <h3>These are example workouts, showing our variaty of exercises</h3>
            </div>

            
            
            </div>

            <div className='workouts-container'>
                {workouts.map((workout) => (
                    <div className='workout-item' key={workout.id}>
                        <h3>{workout.name}</h3>
                        <ul className='exercise-list'>
                            {workout.exercises.map((exercise) => (
                                <li key={exercise.id}>
                                    {exercise.name} - {exercise.repetitions} reps
                                </li>
                                
                            ))}
                            <button className='select-workout-button'>Select Workout</button>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}