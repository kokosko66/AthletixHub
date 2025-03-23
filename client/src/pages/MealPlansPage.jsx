import React, { useState } from 'react';
import '../styles/MealPlanPage.css';
import NavBar from '../components/NavBar';

const MealPlanPage = () => {
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: "Breakfast",
      foods: [
        { name: "Scrambled Eggs", calories: 140, quantity: "2 eggs" },
        { name: "Whole Wheat Toast", calories: 80, quantity: "1 slice" },
        { name: "Avocado", calories: 120, quantity: "1/2" },
        { name: "Orange Juice", calories: 110, quantity: "1 cup" }
      ]
    },
    {
      id: 2,
      name: "Lunch",
      foods: [
        { name: "Grilled Chicken", calories: 165, quantity: "4 oz" },
        { name: "Brown Rice", calories: 216, quantity: "1 cup" },
        { name: "Steamed Broccoli", calories: 55, quantity: "1 cup" },
        { name: "Olive Oil", calories: 120, quantity: "1 tbsp" }
      ]
    },
    {
      id: 3,
      name: "Dinner",
      foods: [
        { name: "Salmon", calories: 206, quantity: "4 oz" },
        { name: "Sweet Potato", calories: 180, quantity: "1 medium" },
        { name: "Asparagus", calories: 40, quantity: "1 cup" },
        { name: "Mixed Berries", calories: 85, quantity: "1 cup" }
      ]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    foods: [{ name: "", calories: 0, quantity: "" }]
  });

  const handleAddMeal = () => {
    if (newMeal.name.trim() === "") return;
    
    const mealWithValidFoods = {
      ...newMeal,
      id: meals.length + 1,
      foods: newMeal.foods.filter(food => food.name.trim() !== "")
    };
    
    setMeals([...meals, mealWithValidFoods]);
    setNewMeal({ name: "", foods: [{ name: "", calories: 0, quantity: "" }] });
    setShowForm(false);
  };

  const handleAddFood = () => {
    setNewMeal({
      ...newMeal,
      foods: [...newMeal.foods, { name: "", calories: 0, quantity: "" }]
    });
  };

  const handleFoodChange = (index, field, value) => {
    const updatedFoods = [...newMeal.foods];
    updatedFoods[index] = { ...updatedFoods[index], [field]: value };
    setNewMeal({ ...newMeal, foods: updatedFoods });
  };

  const calculateTotalCalories = (foods) => {
    return foods.reduce((sum, food) => sum + food.calories, 0);
  };

  return (
    <div>
        <NavBar/>
    <div className="container">
        
      <h1 className="page-title">Meal Plan Library</h1>
      <p className="page-description">Explore our collection of meals or create your own</p>
      
      <div className="create-button-container">
        <button 
          className="create-button"
          onClick={() => setShowForm(true)}
        >
          <span className="plus-icon">+</span> Create New Meal
        </button>
      </div>
      
      {showForm && (
        <div className="form-container">
          <h2 className="form-title">Create New Meal</h2>
          <div className="form-group">
            <label className="form-label">Meal Name</label>
            <input
              type="text"
              className="form-input"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              placeholder="e.g., Breakfast, Lunch, Dinner, Snack"
            />
          </div>
          
          <h3 className="form-subtitle">Foods</h3>
          {newMeal.foods.map((food, index) => (
            <div key={index} className="food-inputs">
              <div className="food-input-group">
                <label className="form-label">Food Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={food.name}
                  onChange={(e) => handleFoodChange(index, "name", e.target.value)}
                  placeholder="e.g., Chicken Breast"
                />
              </div>
              <div className="food-input-group">
                <label className="form-label">Calories</label>
                <input
                  type="number"
                  className="form-input"
                  value={food.calories}
                  onChange={(e) => handleFoodChange(index, "calories", parseInt(e.target.value) || 0)}
                  placeholder="e.g., 165"
                />
              </div>
              <div className="food-input-group">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  className="form-input"
                  value={food.quantity}
                  onChange={(e) => handleFoodChange(index, "quantity", e.target.value)}
                  placeholder="e.g., 4 oz, 1 cup"
                />
              </div>
            </div>
          ))}
          
          <div className="form-actions">
            <button 
              className="add-food-button"
              onClick={handleAddFood}
            >
              + Add Another Food
            </button>
          </div>
          
          <div className="form-buttons">
            <button 
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button 
              className="save-button"
              onClick={handleAddMeal}
            >
              Save Meal
            </button>
          </div>
        </div>
      )}
      
      <div className="meal-grid">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <div className="meal-header">
              <h2 className="meal-title">{meal.name}</h2>
              <p className="meal-count">{meal.foods.length} foods</p>
            </div>
            
            <div className="meal-content">
              {meal.foods.map((food, idx) => (
                <div key={idx} className="food-item">
                  <div className="food-info">
                    <p className="food-name">{food.name}</p>
                    <p className="food-quantity">{food.quantity}</p>
                  </div>
                  <div className="food-calories">
                    <p>{food.calories} cals</p>
                  </div>
                </div>
              ))}
              
              <div className="total-calories">
                <p>Total Calories</p>
                <p>{calculateTotalCalories(meal.foods)} cals</p>
              </div>
              
              <button className="add-to-plan-button">
                Add To Meals Eaten Today
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default MealPlanPage;