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
        password: '',
        short_description: '',
        family_name: '',
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
            <div className="header">
                <div className="logo">
                    <img src={dumbbell} alt="AthletixHub logo" className="dumbbell-icon" />
                    <h1>AthletixHub</h1>
                </div>
            </div>
            
            <div className="main-content">
                <div className="page-title">
                    <h1>Create Your Account</h1>
                    <p>Explore our collection of workouts or create your own</p>
                </div>
                
                <div className="register-card">
                    <div className="role-switch-container">
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
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Enter your first name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Last Name</label>
                                <input 
                                    type="text" 
                                    name="family_name"
                                    placeholder="Enter your last name"
                                    value={formData.family_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Level</label>
                        </div>

                        <div className="form-group">
                            <label>About You</label>
                            <textarea
                                rows="3" 
                                name="short_description"
                                placeholder="Tell us about your fitness goals or expertise"
                                value={formData.short_description}
                                onChange={handleChange}
                                className="description-field"
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}

                        <button type="submit" className="primary-button">Create Profile</button>
                        
                        <div className="login-prompt">
                            <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="footer">
                <p>©2025 AthletixHub. All rights reserved.</p>
            </div>
        </div>
    );
}
