import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import Dialog from "../components/Dialog";
import "../styles/Dialog.css";
import '../styles/TrainersPage.css'

export default function TrainersPage() {
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:3000/api/users/role/trainer")
            .then((response) => {
                setTrainers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    // Helper function to safely get initials
    const getInitials = (trainer) => {
        if (!trainer) return '?';
        
        const firstName = trainer.name || '';
        const lastName = trainer.family_name || '';
        
        if (firstName && lastName && lastName.length > 0) {
            return firstName.charAt(0) + lastName.charAt(0);
        } else if (firstName && firstName.length > 0) {
            return firstName.charAt(0);
        } else {
            return '?';
        }
    };

    // Get display name
    const getDisplayName = (trainer) => {
        if (!trainer) return 'Trainer';
        
        if (trainer.name && trainer.family_name) {
            return `${trainer.name} ${trainer.family_name}`;
        } else if (trainer.name) {
            return trainer.name;
        } else {
            return 'Trainer';
        }
    };

    return (
        <div className="trainers-page">
            <NavBar />
            <div className="trainers-container">
                <p className="trainers-subtitle">Choose a trainer and request a personalized workout plan</p>
                
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading trainers...</p>
                    </div>
                ) : (
                    <div className="trainers-grid">
                        {trainers.map((trainer) => (
                            <div className="trainer-card" key={trainer.id}>
                                <div className="trainer-avatar">
                                    {getInitials(trainer)}
                                </div>
                                <h3 className="trainer-name">
                                    {getDisplayName(trainer)}
                                </h3>
                                <p className="trainer-description">
                                    {trainer.short_description || 'No description provided'}
                                </p>
                                <button 
                                    onClick={() => setSelectedTrainer(trainer)} 
                                    className="request-workout-btn"
                                >
                                    Request Workout
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {selectedTrainer && (
                    <Dialog isOpen={!!selectedTrainer} onClose={() => setSelectedTrainer(null)}>
                        <div className="dialog-content">
                            <div className="dialog-header">
                                <div className="dialog-avatar">
                                    {getInitials(selectedTrainer)}
                                </div>
                                <h2>Request Workout with {getDisplayName(selectedTrainer)}</h2>
                            </div>
                            <p className="dialog-description">
                                {selectedTrainer.short_description || 'No description available'}
                            </p>
                            <div className="dialog-actions">
                                <button className="dialog-cancel" onClick={() => setSelectedTrainer(null)}>Cancel</button>
                                <button className="dialog-request">Request Workout</button>
                            </div>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    );
}