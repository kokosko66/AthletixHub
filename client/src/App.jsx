import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TrainersPage from './pages/TrainersPage';
import WorkoutPage from './pages/WorkoutPage';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path='/workouts' element={<WorkoutPage/>}/>
        <Route path='/profile'  element={<ProfilePage/>}/>
      </Routes>
    </Router>
  )
}

export default App;
