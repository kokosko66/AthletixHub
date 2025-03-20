import '../styles/NavBar.css';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return(
        <div className="top-bar">
            <h1>AthletixHub</h1>
            <nav>
                <ul>
                    <li><Link className='link-design' to='/trainers'>Trainers</Link></li>
                    <li><Link className='link-design' to='/workouts'>Workouts</Link></li>
                    <li><Link className='link-design' to='/meals'>Meals</Link></li>
                    <li><Link className='link-design' to='/profile'>Profile</Link></li>
                </ul>
            </nav>
        </div>
    );
}