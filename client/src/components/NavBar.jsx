import '../styles/NavBar.css';
import dumbbell from '../assets/dumbbell.png';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return(
        <div className="top-bar">
            <h1><img src={dumbbell} alt="icon" className='dumbbell-icon' />AthletixHub</h1>
            <nav>
                <ul>
                    <li><Link className='link-design' to='/trainers'>Trainers</Link></li>
                    <li><Link className='link-design'>Workouts</Link></li>
                    <li><Link className='link-design'>Meals</Link></li>
                    <li><Link className='link-design'>Profile</Link></li>
                </ul>
            </nav>
        </div>
    );
}