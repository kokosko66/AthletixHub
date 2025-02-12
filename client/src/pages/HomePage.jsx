import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/HomePage.css";

const workouts = [
  { id: 1, name: "Chest & Triceps", progress: [{ day: "Mon", value: 50 }, { day: "Wed", value: 55 }, { day: "Fri", value: 60 }] },
  { id: 2, name: "Leg Day", progress: [{ day: "Mon", value: 80 }, { day: "Thu", value: 85 }] },
  { id: 3, name: "Back & Biceps", progress: [{ day: "Tue", value: 65 }, { day: "Sat", value: 70 }] },
];

const trainers = [
  { id: 1, name: "John Doe", specialty: "Strength Training" },
  { id: 2, name: "Jane Smith", specialty: "Cardio & HIIT" },
  { id: 3, name: "Mike Johnson", specialty: "Weight Loss" },
];

export default function HomePage() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  return (
    <div className="homepage-container">
      <nav className="navbar">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/workouts">Workouts</a></li>
          <li><a href="/meal-plans">Meal Plans</a></li>
          <li><a href="/account">Account</a></li>
        </ul>
      </nav>
      
      <h1 className="homepage-title">Welcome to ATHLETIXHUB</h1>
      
      <div className="workouts-section">
        <h2 className="section-title">Last Workouts</h2>
        <div className="workouts-list">
          {workouts.map((workout) => (
            <div key={workout.id} onClick={() => setSelectedWorkout(workout)} className="workout-item">
              <p className="workout-name">{workout.name}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedWorkout && (
        <div className="progress-section">
          <h2 className="section-title">Progress for {selectedWorkout.name}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={selectedWorkout.progress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="trainers-section">
        <h2 className="section-title">Available Trainers</h2>
        <div className="trainers-list">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="trainer-item">
              <p className="trainer-name">{trainer.name}</p>
              <p className="trainer-specialty">{trainer.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
