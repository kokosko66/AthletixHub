import { useState } from 'react';
import { Link } from 'react-router-dom';
import dumbbell from '../assets/dumbbell.png';
import '../styles/RegisterPage.css';
import axios from 'axios';

export default function RegisterPage() {
    const [role, setRole] = useState('trainee');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const payload = {
                ...formData,
                role
            }
            const response = await axios.post('http://localhost:3000/api/users', payload, 
                { headers: { 'Content-Type': 'application/json' } }
            );

            setSuccess('Account created successfully!');
            console.log('User registered:', response.data);

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
            console.error('Registration error:', err);
        }
    };

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
                            onClick={() => setRole('trainee')} 
                            className={`role-button ${role === 'trainee' ? 'active' : ''}`}
                        >
                            Trainee
                        </button>
                        <button 
                            onClick={() => setRole('trainer')} 
                            className={`role-button ${role === 'trainer' ? 'active' : ''}`}
                        >
                            Trainer
                        </button>
                        <div className="switch-indicator"></div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label>Name</label>
                        <br/>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <br/>

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

                        <label>Phone</label>
                        <br />
                        <input 
                            type="tel" 
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
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

                        <button type="submit" className='profile-button'>Create Profile</button>
                        <br />
                        <br />
                        <p className='if-login'>Already have an account? <Link className='login-link' to='/login'>Login</Link></p>
                    </form>
                </div>
            </div>
            <div className="register-footer">
                <p>©2025 AthletixHub. All rights reserved.</p>
            </div>
        </div>
    );
}
