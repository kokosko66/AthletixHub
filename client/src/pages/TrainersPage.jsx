import { useEffect, useState } from 'react';
import '../styles/TrainersPage.css';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TrainersPage() {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/users/role/trainer')
            .then((response) => {
                setTrainers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div className='trainers-page'>
            <NavBar />
            <section>
                {
                    trainers.map((trainer) => (
                        <ul className='trainers-list' key={trainer.id}>
                            <li>{trainer.name} <Link className='request-workout'>Request Workout</Link></li>
                        </ul>
                    ))
                }
            </section>
        </div>
    );
}