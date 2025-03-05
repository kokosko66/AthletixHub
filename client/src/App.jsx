import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TrainersPage from './pages/TrainersPage';
import WorkoutPage from './pages/WorkoutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path='/workouts' element={<WorkoutPage/>}></Route>
      </Routes>
    </Router>
  )
}

export default App;
