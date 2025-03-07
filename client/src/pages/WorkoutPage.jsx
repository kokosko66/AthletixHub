import NavBar from '../components/NavBar';
import '../styles/WorkoutPage.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TrainersPage() {

    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/workouts')
            .then((response) => {
                setWorkouts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    
    return(
        <div className="wokrouts-container">
            <NavBar />
            <div className='create-workout-button'>
                <button>Create Workout</button>
            </div>
            <div className='workouts-container'>
                {
                    workouts.map((workout) => (
                        <ul className='workouts-list' key={workout.id}>
                            <li>{workout.name}</li>
                        </ul>
                    ))
                }
            </div>
        </div>
    );
}