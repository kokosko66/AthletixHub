import NavBar from '../components/NavBar';
import '../styles/WorkoutPage.css';
import {useState} from 'react';

export default function TrainersPage() {
    const [workouts, setWorkouts] = useState([]);
    
    return(
        <div className="wokrouts-container">
            <NavBar />
            <div className='create-workout-button'>
                <button>Create Workout</button>
            </div>
        </div>
    );
}