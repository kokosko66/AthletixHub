import '../styles/LoginPage.css';
import dumbbell from '../assets/dumbbell.png';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:3000/api/login', formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setSuccess('Login successful!');
            console.log('User logged in:', response.data);

            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password!');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="container">
            <div className="top-container">
                <h1><img src={dumbbell} alt="icon" className='dumbbell-icon' />AthletixHub</h1>
            </div>
            <div className="main-container">
                <div className="login-form">
                    <h2>Welcome Back To AthletixHub</h2>

                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <br />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Enter your email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                        <br />
                        <label>Password</label>
                        <br />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Enter your password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                        <br />

                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}

                        <button type="submit" className='profile-button'>Login</button>
                    </form>
                </div>
            </div>
            <div className="login-footer">
                <p>©2025 AthletixHub. All rights reserved.</p>
            </div>
        </div>
    );
}
