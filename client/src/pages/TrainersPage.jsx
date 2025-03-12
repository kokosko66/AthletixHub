import { useEffect, useState } from "react";
import "../styles/TrainersPage.css";
import NavBar from "../components/NavBar";
import axios from "axios";
import Dialog from "../components/Dialog";
import "../styles/Dialog.css";

export default function TrainersPage() {
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/users/role/trainer")
            .then((response) => {
                setTrainers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="trainers-page">
            <NavBar />
            <section>
                {trainers.map((trainer) => (
                    <ul className="trainers-list" key={trainer.id}>
                        <li>
                            {trainer.name} <span>description</span>{" "}
                            <button 
                                onClick={() => setSelectedTrainer(trainer)} 
                                className="request-workout"
                            >
                                Request Workout
                            </button>
                        </li>
                    </ul>
                ))}

                <Dialog isOpen={!!selectedTrainer} onClose={() => setSelectedTrainer(null)}>
                    <h2>Request Workout with {selectedTrainer?.name}</h2>
                    <p>Here you can request a workout session.</p>
                </Dialog>
            </section>
        </div>
    );
}
