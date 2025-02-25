import { useState } from 'react';

import dumbbell from '../assets/dumbbell.png';
import '../styles/RegisterPage.css';

export default function Loginpage() {
    const [role, setRole]  = useState('trainee');

    return (
        <div className="container">
            <div className="top-container">
                <h1><img src={dumbbell} alt="icon" className='dumbbell-icon' />AthletixHub</h1>
            </div>
            <div className='main-container'>
                <div className="register-form">
                    <h2>Join AthletixHub</h2>
                    <div className={`role-switch ${role === 'trainer' ? 'trainer-active' : ''}`}>
                        <button 
                            onClick={() => { setRole('trainee'); }} 
                            className='role-button'
                        >
                            Trainee
                        </button>
                        <button 
                            onClick={() => { setRole('trainer'); }} 
                            className='role-button'
                        >
                            Trainer
                        </button>
                        <div className="switch-indicator"></div>
                    </div>

                    <form>
                        <label>Name</label>
                        <br/>
                        <input type="text" placeholder="Enter your name"/>
                        <br/>
                        <label>Email</label>
                        <br />
                        <input type="email" placeholder="Enter your email"/>
                        <br />
                        <label>Phone</label>
                        <br />
                        <input type="tel" placeholder="Enter your phone number"/>
                        <br />
                        <label>Password</label>
                        <br />
                        <input type="password" placeholder="Enter your password"/>
                        <br />
                        <button className='profile-button'>Create Profile</button>
                        <br />
                        <br />
                        <p className='if-login'>Already have an account? <a href='/login' className='login-link'>Login</a></p>
                    </form>
                </div>
            </div>
            <div className="footer">
                <p>©2025 AthletixHub. All rights reserved.</p>
            </div>
        </div>
    );
}