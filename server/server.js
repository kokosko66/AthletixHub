import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './src/users/routes.js';
import workoutRoutes from './src/workouts/routes.js';
import exerciseRoutes from './src/exercises/routes.js';
import foodsRoutes from './src/foods/routes.js';
import mealPlansRoutes from './src/meal_plans/routes.js';
import userWorkoutsRoutes from './src/user_workouts/routes.js';
import userMealPlansRoutes from './src/user_meal_plans/routes.js';
import workoutExercisesRoutes  from './src/workout_exercises/routes.js';
import mealPlanFoods from './src/meal_plan_foods/routes.js';
import workoutExerciseRelationRoutes from './src/workout_exercise_relation/routes.js';
import { conroller } from './src/controller.js';


const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to AthletixHub API');
});


app.use('/api', userRoutes);
app.use('/api', workoutRoutes);
app.use('/api', exerciseRoutes);
app.use('/api', foodsRoutes);
app.use('/api', mealPlansRoutes);
app.use('/api', userWorkoutsRoutes);
app.use('/api', userMealPlansRoutes);
app.use('/api', workoutExercisesRoutes);
app.use('/api', mealPlanFoods);
app.use('/api', workoutExerciseRelationRoutes);

app.post('/api/login', conroller.login);
app.post('/api/register', conroller.register);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
