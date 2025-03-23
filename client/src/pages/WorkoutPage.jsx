import NavBar from '../components/NavBar';
import '../styles/WorkoutPage.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Dialog from '../components/Dialog';
import { useNavigate } from 'react-router-dom';

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState('');
    const [exercises, setExercises] = useState([{ name: '', repetitions: '' }]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [userWorkouts, setUserWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3000/api/user_workouts?userId=${user.id}`)
                .then((response) => {
                    setUserWorkouts(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user workouts:", error);
                });
        } else {
            setUserWorkouts([]);
        }
    }, [user]);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:3000/api/workout_exercise_relation')
            .then((response) => {
                const groupedWorkouts = groupExercisesByWorkout(response.data);
                setWorkouts(groupedWorkouts);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
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
                
                axios.get('http://localhost:3000/api/workout_exercise_relation')
                    .then((response) => {
                        setWorkouts(groupExercisesByWorkout(response.data));
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    };
    
    const selectWorkout = async (workoutId) => {
        if (!user) return;
    
        try {
            const response = await axios.post('http://localhost:3000/api/user_workouts', {
                userId: user.id,
                workoutId: workoutId
            });
    
            if (response.status === 200) {
                console.log("Workout already selected, no need to re-add.");
            } else {
                console.log("Workout added successfully.");
            }
    
            await fetchUserWorkouts();
        } catch (error) {
            console.error("Error adding workout:", error.response?.data || error.message);
        }
    };
    
    const fetchUserWorkouts = async () => {
        if (!user) return;
    
        try {
            const response = await axios.get(`http://localhost:3000/api/user_workouts?userId=${user.id}`);
            setUserWorkouts(response.data);
        } catch (error) {
            console.error("Error fetching user workouts:", error);
        }
    };

    const removeExerciseField = (index) => {
        if (exercises.length > 1) {
            const updatedExercises = exercises.filter((_, i) => i !== index);
            setExercises(updatedExercises);
        }
    };
    
    return (
        <div className="workout-page">
            <NavBar />
            
            <div className="workout-container">
                <div className="workout-header">
                    <h1>Workout Library</h1>
                    <p className="workout-subtitle">Explore our collection of workouts or create your own</p>
                    
                    <button className="create-workout-button" onClick={() => setIsDialogOpen(true)}>
                        <span className="button-icon">+</span>
                        Create New Workout
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading workouts...</p>
                    </div>
                ) : (
                    <div className="workouts-grid">
                        {workouts.map((workout) => (
                            <div className="workout-card" key={workout.id}>
                                <div className="workout-card-header">
                                    <h3>{workout.name}</h3>
                                    <span className="exercise-count">{workout.exercises.length} exercises</span>
                                    {/* <p>Repetitions for a week <textarea className='reps' placeholder='e.g 2'></textarea></p> */}
                                </div>
                                
                                <div className="workout-card-content">
                                    <ul className="exercise-list">
                                        {workout.exercises.map((exercise) => (
                                            <li key={exercise.id}>
                                                <span className="exercise-name">{exercise.name}</span>
                                                <span className="exercise-reps">{exercise.repetitions} reps</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="workout-card-footer">
                                    <button 
                                        onClick={() => selectWorkout(workout.id)}
                                        className={`select-workout-button ${userWorkouts.some((uw) => uw.workout_id === workout.id) ? 'selected' : ''}`}
                                        disabled={userWorkouts.some((uw) => uw.workout_id === workout.id)}
                                    >
                                        {userWorkouts.some((uw) => uw.workout_id === workout.id) ? "Added to My Workouts" : "Add to My Workouts"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <div className="dialog-container">
                    <h2 className="dialog-title">Create a New Workout</h2>
                    
                    <div className="dialog-form">
                        <div className="form-group">
                            <label htmlFor="workout-name">Workout Name</label>
                            <input
                                id="workout-name"
                                type="text"
                                className="dialog-input"
                                placeholder="e.g., Full Body Strength"
                                value={newWorkoutName}
                                onChange={(e) => setNewWorkoutName(e.target.value)}
                            />
                        </div>

                        <h3 className="dialog-subtitle">Exercises</h3>
                        
                        {exercises.map((exercise, index) => (
                            <div key={index} className="exercise-input-group">
                                <div className="form-group exercise-name-group">
                                    <input
                                        type="text"
                                        className="dialog-input"
                                        placeholder="Exercise Name"
                                        value={exercise.name}
                                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                    />
                                </div>
                                
                                <div className="form-group exercise-reps-group">
                                    <input
                                        type="number"
                                        className="dialog-input"
                                        placeholder="Reps"
                                        value={exercise.repetitions}
                                        onChange={(e) => handleExerciseChange(index, 'repetitions', e.target.value)}
                                    />
                                </div>
                                
                                <button 
                                    type="button" 
                                    className="remove-exercise-button"
                                    onClick={() => removeExerciseField(index)}
                                    disabled={exercises.length === 1}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        <div className="dialog-buttons">
                            <button className="dialog-button add-exercise" onClick={addExerciseField}>
                                <span className="button-icon">+</span> Add Exercise
                            </button>
                            
                            <button 
                                className="dialog-button create-workout" 
                                onClick={createWorkout}
                                disabled={!newWorkoutName || exercises.some(ex => !ex.name || !ex.repetitions)}
                            >
                                Create Workout
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}