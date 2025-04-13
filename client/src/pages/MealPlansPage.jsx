import React, { useState, useEffect } from "react";
import "../styles/MealPlanPage.css";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MealPlanPage = () => {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [newMeal, setNewMeal] = useState({
    name: "",
    foods: [{ name: "", calories: 0, quantity: "" }],
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  ); // Today's date
  const [errorMessage, setErrorMessage] = useState("");
  const [mealFoods, setMealFoods] = useState({}); // Store foods for each meal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Store the meal ID to delete

  const navigate = useNavigate();

  // Load user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch meals and foods from the server
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Fetch meal plans for the current user only
      axios
        .get(`http://localhost:3000/api/meal_plans/user/${user.id}`)
        .then((response) => {
          setMeals(response.data);
          // Fetch foods for each meal plan
          response.data.forEach((meal) => {
            fetchMealFoods(meal.id);
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching meal plans:", error);
          setLoading(false);
        });

      // Fetch completed meals for the selected date
      fetchCompletedMeals();
    }
  }, [user, selectedDate]);

  // Function to fetch foods for a specific meal plan
  const fetchMealFoods = async (mealPlanId) => {
    try {
      // Fetch the foods associated with this meal plan
      const response = await axios.get(
        `http://localhost:3000/api/meal_plans/id/${mealPlanId}/foods`,
      );

      // Store the foods in the mealFoods state
      setMealFoods((prev) => ({
        ...prev,
        [mealPlanId]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching foods for meal plan ${mealPlanId}:`, error);
    }
  };

  const fetchCompletedMeals = async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/completed_meals/user/${user.id}/date/${selectedDate}`,
      );
      setCompletedMeals(response.data);
    } catch (error) {
      console.error("Error fetching completed meals:", error);
    }
  };

  // In the createMealPlan function - now associates meal with user
  const createMealPlan = async (mealName) => {
    try {
      // Format the date properly for MySQL
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

      const mealData = {
        name: mealName,
        created_at: formattedDate,
        user_id: user.id, // Associate meal with the current user
      };

      console.log("Creating meal plan with data:", mealData);

      const response = await axios.post(
        "http://localhost:3000/api/meal_plans",
        mealData,
      );
      console.log("Meal plan creation response:", response);

      if (response.data && response.data.id) {
        return response.data.id;
      } else {
        throw new Error("Failed to get meal plan ID from response");
      }
    } catch (error) {
      console.error("Error in createMealPlan:", error);
      throw error;
    }
  };

  const createFood = async (foodName, calories) => {
    try {
      // First check if food exists by name
      const existingFoodResponse = await axios.get(
        `http://localhost:3000/api/foods/name/${encodeURIComponent(foodName)}`,
      );

      if (existingFoodResponse.data && existingFoodResponse.data.length > 0) {
        console.log("Found existing food:", existingFoodResponse.data[0]);
        return existingFoodResponse.data[0].id;
      }

      // If food doesn't exist, create it
      const foodData = {
        name: foodName,
        calories: parseInt(calories) || 0,
      };

      console.log("Creating food with data:", foodData);
      const response = await axios.post(
        "http://localhost:3000/api/foods",
        foodData,
      );
      console.log("Food creation response:", response);

      if (response.data && response.data.id) {
        return response.data.id;
      } else {
        throw new Error("Failed to get food ID from response");
      }
    } catch (error) {
      console.error("Error in createFood:", error);
      throw error;
    }
  };

  const associateFoodWithMeal = async (mealPlanId, foodId, quantity) => {
    try {
      const data = {
        meal_plan_id: mealPlanId,
        food_id: foodId,
        quantity: quantity || null,
      };

      console.log("Associating food with meal:", data);
      const response = await axios.post(
        "http://localhost:3000/api/meal_plan_foods",
        data,
      );
      console.log("Association response:", response);

      return true;
    } catch (error) {
      console.error("Error in associateFoodWithMeal:", error);
      throw error;
    }
  };

  // Function to delete a meal plan - verify user owns the meal plan
  const deleteMealPlan = async (mealPlanId) => {
    try {
      setLoading(true);

      // Delete the meal plan
      await axios.delete(`http://localhost:3000/api/meal_plans/${mealPlanId}`);

      // Update the state by removing the deleted meal plan
      setMeals((prevMeals) =>
        prevMeals.filter((meal) => meal.id !== mealPlanId),
      );

      // Also remove from mealFoods state
      setMealFoods((prevMealFoods) => {
        const updatedMealFoods = { ...prevMealFoods };
        delete updatedMealFoods[mealPlanId];
        return updatedMealFoods;
      });

      // Close the confirmation dialog
      setShowDeleteConfirm(null);

      // Show success message
      alert("Meal plan deleted successfully!");
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      alert("Failed to delete meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to edit a meal plan
  const editMealPlan = (mealId) => {
    // Find the meal to edit
    const mealToEdit = meals.find((meal) => meal.id === mealId);
    const foodsToEdit = mealFoods[mealId] || [];

    // Prepare the edit form data
    setNewMeal({
      name: mealToEdit.name,
      foods:
        foodsToEdit.length > 0
          ? foodsToEdit.map((food) => ({
              id: food.id,
              name: food.name,
              calories: food.calories,
              quantity: food.quantity || "",
            }))
          : [{ name: "", calories: 0, quantity: "" }],
    });

    // Set editing state
    setIsEditing(true);
    setEditingMealId(mealId);
    setShowForm(true);
  };

  // Function to update a meal plan - updated API endpoints
  const updateMealPlan = async () => {
    if (!newMeal.name.trim()) {
      setErrorMessage("Please enter a meal name");
      return;
    }

    const validFoods = newMeal.foods.filter((food) => food.name.trim() !== "");
    if (validFoods.length === 0) {
      setErrorMessage("Please add at least one food item");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      // 1. Update the meal plan name
      await axios.put(`http://localhost:3000/api/meal_plans/${editingMealId}`, {
        name: newMeal.name,
        user_id: user.id, // Include user ID to verify ownership
      });

      // 2. Delete existing associations between meal plan and foods
      await axios.delete(
        `http://localhost:3000/api/meal_plan_foods/meal/${editingMealId}`,
      );

      // 3. Create new food associations
      for (const food of validFoods) {
        try {
          const foodId = await createFood(food.name, food.calories);
          await associateFoodWithMeal(editingMealId, foodId, food.quantity);
        } catch (foodError) {
          console.error("Error processing food:", food.name, foodError);
        }
      }

      // 4. Refresh meals list for the current user
      const mealsResponse = await axios.get(
        `http://localhost:3000/api/meal_plans/user/${user.id}`,
      );
      setMeals(mealsResponse.data);

      // 5. Refresh foods for the updated meal plan
      fetchMealFoods(editingMealId);

      // Reset form and state
      setNewMeal({
        name: "",
        foods: [{ name: "", calories: 0, quantity: "" }],
      });
      setShowForm(false);
      setIsEditing(false);
      setEditingMealId(null);

      alert("Meal plan updated successfully!");
    } catch (error) {
      console.error("Error updating meal plan:", error);

      // Enhanced error message
      let errorMsg = "Failed to update meal plan.";
      if (error.response) {
        errorMsg += ` Server error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        errorMsg += " Server did not respond. Please check your connection.";
      } else {
        errorMsg += ` ${error.message}`;
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.name.trim()) {
      setErrorMessage("Please enter a meal name");
      return;
    }

    const validFoods = newMeal.foods.filter((food) => food.name.trim() !== "");
    if (validFoods.length === 0) {
      setErrorMessage("Please add at least one food item");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      // If editing, update the meal plan
      if (isEditing && editingMealId) {
        await updateMealPlan();
        return;
      }

      // Otherwise create a new meal plan
      // Step 1: Create the meal plan with user ID
      const mealPlanId = await createMealPlan(newMeal.name);
      console.log("Created meal plan with ID:", mealPlanId);

      // Step 2: Create foods and associate them with the meal plan
      for (const food of validFoods) {
        try {
          const foodId = await createFood(food.name, food.calories);
          console.log("Food ID:", foodId);

          await associateFoodWithMeal(mealPlanId, foodId, food.quantity);
        } catch (foodError) {
          console.error("Error processing food:", food.name, foodError);
        }
      }

      // Step 3: Refresh meals list for the current user
      const mealsResponse = await axios.get(
        `http://localhost:3000/api/meal_plans/user/${user.id}`,
      );
      setMeals(mealsResponse.data);

      // Fetch foods for the new meal plan
      fetchMealFoods(mealPlanId);

      // Reset form
      setNewMeal({
        name: "",
        foods: [{ name: "", calories: 0, quantity: "" }],
      });
      setShowForm(false);

      alert("Meal plan created successfully!");
    } catch (error) {
      console.error("Error creating meal plan:", error);

      // Enhanced error message
      let errorMsg = "Failed to create meal plan.";
      if (error.response) {
        // Server responded with an error
        errorMsg += ` Server error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        // Request was made but no response
        errorMsg += " Server did not respond. Please check your connection.";
      } else {
        // Error in setting up request
        errorMsg += ` ${error.message}`;
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = () => {
    setNewMeal({
      ...newMeal,
      foods: [...newMeal.foods, { name: "", calories: 0, quantity: "" }],
    });
  };

  const handleFoodChange = (index, field, value) => {
    const updatedFoods = [...newMeal.foods];
    updatedFoods[index] = { ...updatedFoods[index], [field]: value };
    setNewMeal({ ...newMeal, foods: updatedFoods });
  };

  const removeFood = (index) => {
    if (newMeal.foods.length > 1) {
      const updatedFoods = newMeal.foods.filter((_, i) => i !== index);
      setNewMeal({ ...newMeal, foods: updatedFoods });
    }
  };

  const calculateTotalCalories = (foods) => {
    if (!foods || foods.length === 0) return 0;
    return foods.reduce((sum, food) => sum + (parseInt(food.calories) || 0), 0);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const toggleMealCompletion = async (mealId) => {
    if (!user) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/completed_meals",
        {
          userId: user.id,
          mealPlanId: mealId,
          completedDate: selectedDate,
        },
      );

      console.log("Meal completion toggled:", response.data);

      // Refresh completed meals
      fetchCompletedMeals();
    } catch (error) {
      console.error("Error toggling meal completion:", error);
      alert("Failed to mark meal as eaten. Please try again.");
    }
  };

  const isMealCompleted = (mealId) => {
    return completedMeals.some((cm) => cm.meal_plan_id === mealId);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingMealId(null);
    setNewMeal({
      name: "",
      foods: [{ name: "", calories: 0, quantity: "" }],
    });
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading meals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="page-title">Meal Plan Library</h1>
        <p className="page-description">Create your own meal library</p>

        <div className="top-controls">
          <div className="date-picker-container">
            <label htmlFor="meal-date">Track meals for:</label>
            <input
              type="date"
              id="meal-date"
              value={selectedDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]} // Prevent selecting future dates
            />
          </div>

          <div className="create-button-container">
            <button className="create-button" onClick={() => setShowForm(true)}>
              <span className="plus-icon">+</span> Create New Meal
            </button>
          </div>
        </div>

        {showForm && (
          <div className="form-container">
            <h2 className="form-title">
              {isEditing ? "Edit Meal Plan" : "Create New Meal"}
            </h2>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <div className="form-group">
              <label className="form-label">Meal Name</label>
              <input
                type="text"
                className="form-input"
                value={newMeal.name}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, name: e.target.value })
                }
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
                    onChange={(e) =>
                      handleFoodChange(index, "name", e.target.value)
                    }
                    placeholder="e.g., Chicken Breast"
                  />
                </div>
                <div className="food-input-group">
                  <label className="form-label">Calories</label>
                  <input
                    type="number"
                    className="form-input"
                    value={food.calories}
                    onChange={(e) =>
                      handleFoodChange(index, "calories", e.target.value)
                    }
                    placeholder="e.g., 165"
                  />
                </div>
                <div className="food-input-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="text"
                    className="form-input"
                    value={food.quantity}
                    onChange={(e) =>
                      handleFoodChange(index, "quantity", e.target.value)
                    }
                    placeholder="e.g., 4 oz, 1 cup"
                  />
                </div>
                <button
                  type="button"
                  className="remove-food-button"
                  onClick={() => removeFood(index)}
                  disabled={newMeal.foods.length === 1}
                >
                  ×
                </button>
              </div>
            ))}

            <div className="form-actions">
              <button className="add-food-button" onClick={handleAddFood}>
                + Add Another Food
              </button>
            </div>

            <div className="form-buttons">
              <button className="cancel-button" onClick={handleCancelForm}>
                Cancel
              </button>
              <button
                className="save-button"
                onClick={handleAddMeal}
                disabled={
                  !newMeal.name || newMeal.foods.every((food) => !food.name)
                }
              >
                {isEditing ? "Update Meal" : "Save Meal"}
              </button>
            </div>
          </div>
        )}

        <div className="meal-grid">
          {meals.length === 0 ? (
            <div className="no-meals-message">
              <p>No meal plans available. Create your first meal plan!</p>
            </div>
          ) : (
            meals.map((meal) => (
              <div
                key={meal.id}
                className={`meal-card ${isMealCompleted(meal.id) ? "completed" : ""}`}
              >
                <div className="meal-header">
                  <h2 className="meal-title">{meal.name}</h2>
                  <div className="meal-header-actions">
                    <p className="meal-count">
                      {mealFoods[meal.id] ? mealFoods[meal.id].length : 0} foods
                    </p>
                    <div className="meal-action-buttons">
                      <button
                        className="edit-meal-button"
                        onClick={() => editMealPlan(meal.id)}
                        title="Edit meal plan"
                      >
                        ✎
                      </button>
                      <button
                        className="delete-meal-button"
                        onClick={() => setShowDeleteConfirm(meal.id)}
                        title="Delete meal plan"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>

                <div className="meal-content">
                  {mealFoods[meal.id] && mealFoods[meal.id].length > 0 ? (
                    <div className="food-list">
                      {mealFoods[meal.id].map((food) => (
                        <div key={food.id} className="food-item">
                          <div className="food-info">
                            <h4 className="food-name">{food.name}</h4>
                            {food.quantity && (
                              <p className="food-quantity">{food.quantity}</p>
                            )}
                          </div>
                          <div className="food-calories">
                            {food.calories} cal
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="food-list-placeholder">
                      <p>No food items available</p>
                    </div>
                  )}

                  <div className="total-calories">
                    <p>Total Calories</p>
                    <p>
                      {mealFoods[meal.id]
                        ? calculateTotalCalories(mealFoods[meal.id])
                        : "No foods"}
                    </p>
                  </div>

                  <div className="meal-actions">
                    <button
                      className={`add-to-plan-button ${isMealCompleted(meal.id) ? "completed" : ""}`}
                      onClick={() => toggleMealCompletion(meal.id)}
                    >
                      {isMealCompleted(meal.id)
                        ? "Marked as Eaten"
                        : "Add To Meals Eaten"}
                    </button>

                    <button
                      className={`completion-toggle ${isMealCompleted(meal.id) ? "completed" : ""}`}
                      onClick={() => toggleMealCompletion(meal.id)}
                    >
                      {isMealCompleted(meal.id) ? "✓" : ""}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="delete-confirmation-overlay">
            <div className="delete-confirmation-dialog">
              <h3>Delete Meal Plan</h3>
              <p>
                Are you sure you want to delete this meal plan? This action
                cannot be undone and will remove all associated foods.
              </p>
              <div className="delete-confirmation-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-delete-btn"
                  onClick={() => deleteMealPlan(showDeleteConfirm)}
                >
                  Delete Meal Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanPage;
