import '../styles/LoginPage.css';
import dumbbell from '../assets/dumbbell.png';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    return(
        <div className="container">
            <div className="top-container">
                <h1><img src={dumbbell} alt="icon" className='dumbbell-icon' />AthletixHub</h1>
            </div>
            <div className="main-container">
                <div className="login-form">
                    <h2>Welcome Back To AthletixHub</h2>

                    <form>
                        <label>Email</label>
                        <br />
                        <input type="email" placeholder="Enter your email"/>
                        <br />
                        <label>Password</label>
                        <br />
                        <input type="password" placeholder="Enter your password"/>
                        <br />
                        <button className='profile-button'><Link className='login' to='/trainers'>Login</Link></button>

                    </form>
                </div>
            </div>
            <div className="login-footer">
                <p>©2025 AthletixHub. All rights reserved.</p>
            </div>
        </div>
    );
}