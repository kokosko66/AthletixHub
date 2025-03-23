import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import '../styles/ProfilePage.css';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Mock data for charts
    const activityData = [
        { name: 'Mon', value: 65 },
        { name: 'Tue', value: 78 },
        { name: 'Wed', value: 92 },
        { name: 'Thu', value: 83 },
        { name: 'Fri', value: 89 },
        { name: 'Sat', value: 45 },
        { name: 'Sun', value: 52 }
    ];
    
    const skillData = [
        { name: 'Leadership', value: 85 },
        { name: 'Communication', value: 75 },
        { name: 'Technical', value: 90 },
        { name: 'Creativity', value: 70 },
        { name: 'Teamwork', value: 88 }
    ];
    
    // Mock comparison data
    const comparisonData = {
        engagement: { user: 87, average: 72 },
        completion: { user: 94, average: 68 },
        accuracy: { user: 79, average: 65 }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
            // Simulate loading
            setTimeout(() => {
                setUser(JSON.parse(storedUser));
                setLoading(false);
            }, 800);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // Function to render progress circle
    const renderProgressCircle = (percentage, color, size = 120, strokeWidth = 8) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const dash = (percentage * circumference) / 100;
        
        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size/2}
                    cy={size/2}
                    r={radius}
                    fill="transparent"
                    stroke="#e6e6e6"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size/2}
                    cy={size/2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - dash}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
                <text
                    x="50%"
                    y="50%"
                    dy="0.3em"
                    textAnchor="middle"
                    fontSize="1.5rem"
                    fontWeight="bold"
                    fill={color}
                >
                    {percentage}%
                </text>
            </svg>
        );
    };

    // Function to render skill bar
    const renderSkillBar = (name, value, color) => {
        return (
            <div className="skill-bar-container" key={name}>
                <div className="skill-bar-header">
                    <span>{name}</span>
                    <span>{value}%</span>
                </div>
                <div className="skill-bar-background">
                    <div 
                        className="skill-bar-fill" 
                        style={{ width: `${value}%`, backgroundColor: color }}
                    ></div>
                </div>
            </div>
        );
    };

    // Function to render comparison bars
    const renderComparisonBar = (label, userData, avgData, userColor = "#4a47a3", avgColor = "#a3a1e8") => {
        return (
            <div className="comparison-container" key={label}>
                <div className="comparison-label">
                    <span>{label}</span>
                </div>
                <div className="comparison-bars">
                    <div className="comparison-bar-group">
                        <div className="comparison-bar-background">
                            <div 
                                className="comparison-bar-fill" 
                                style={{ width: `${userData}%`, backgroundColor: userColor }}
                            ></div>
                        </div>
                        <span className="comparison-bar-label">You: {userData}%</span>
                    </div>
                    <div className="comparison-bar-group">
                        <div className="comparison-bar-background">
                            <div 
                                className="comparison-bar-fill" 
                                style={{ width: `${avgData}%`, backgroundColor: avgColor }}
                            ></div>
                        </div>
                        <span className="comparison-bar-label">Avg: {avgData}%</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="profile-page">
                <NavBar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <NavBar />
            {user ? (
                <div className="dashboard-container">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.name && user.family_name ? 
                                `${user.name.charAt(0)}${user.family_name.charAt(0)}` : 'U'}
                        </div>
                        <div className="profile-info">
                            <h1>{user.name} {user.family_name}</h1>
                            <p className="profile-role">{user.role}</p>
                            <p className="profile-email">{user.email}</p>
                        </div>
                    </div>
                    
                    <div className="dashboard-grid">
                        <div className="dashboard-card profile-stats">
                            <h2>Your Performance</h2>
                            <div className="stats-container">
                                <div className="stat-item">
                                    {renderProgressCircle(87, "#4a47a3")}
                                    <p>Overall Score</p>
                                </div>
                                <div className="stat-item">
                                    {renderProgressCircle(94, "#6665dd")}
                                    <p>Completion</p>
                                </div>
                                <div className="stat-item">
                                    {renderProgressCircle(79, "#a3a1e8")}
                                    <p>Accuracy</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="dashboard-card profile-skills">
                            <h2>Skills</h2>
                            <div className="skills-container">
                                {skillData.map((skill, index) => (
                                    renderSkillBar(
                                        skill.name, 
                                        skill.value, 
                                        index % 2 === 0 ? "#4a47a3" : "#6665dd"
                                    )
                                ))}
                            </div>
                        </div>
                        
                        <div className="dashboard-card comparison-card">
                            <h2>Comparison with Others</h2>
                            <div className="comparison-wrapper">
                                {Object.entries(comparisonData).map(([key, value]) => (
                                    renderComparisonBar(
                                        key.charAt(0).toUpperCase() + key.slice(1),
                                        value.user,
                                        value.average
                                    )
                                ))}
                            </div>
                        </div>
                        
                        <div className="dashboard-card activity-card">
                            <h2>Weekly Activity</h2>
                            <div className="activity-chart">
                                {activityData.map((day, index) => (
                                    <div className="activity-bar-container" key={day.name}>
                                        <div 
                                            className="activity-bar" 
                                            style={{ 
                                                height: `${day.value}%`,
                                                backgroundColor: index % 2 === 0 ? "#4a47a3" : "#6665dd"
                                            }}
                                        ></div>
                                        <div className="activity-label">{day.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="user-container">
                    <p>Loading user data...</p>
                </div>
            )}
        </div>
    );
}