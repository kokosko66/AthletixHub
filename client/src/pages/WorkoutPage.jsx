import NavBar from "../components/NavBar";
import "../styles/WorkoutPage.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Dialog from "../components/Dialog";
import { useNavigate } from "react-router-dom";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [exercises, setExercises] = useState([{ name: "", repetitions: "" }]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  ); // Today's date in YYYY-MM-DD format
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3000/api/user_workouts?userId=${user.id}`)
        .then((response) => {
          setUserWorkouts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user workouts:", error);
        });

      // Fetch completed workouts for the selected date
      fetchCompletedWorkouts();
    } else {
      setUserWorkouts([]);
      setCompletedWorkouts([]);
    }
  }, [user, selectedDate]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get(
          `http://localhost:3000/api/workout_exercise_relation?userId=${user.id}`,
        )
        .then((response) => {
          const groupedWorkouts = groupExercisesByWorkout(response.data);
          setWorkouts(groupedWorkouts);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      setWorkouts([]);
    }
  }, [user]);

  const fetchCompletedWorkouts = async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/completed_workouts/user/${user.id}/date/${selectedDate}`,
      );
      setCompletedWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching completed workouts:", error);
    }
  };

  const groupExercisesByWorkout = (data) => {
    const workoutMap = new Map();

    data.forEach(
      ({
        workout_id,
        workout_name,
        exercise_id,
        exercise_name,
        repetitions,
      }) => {
        if (!workoutMap.has(workout_id)) {
          workoutMap.set(workout_id, {
            id: workout_id,
            name: workout_name,
            exercises: [],
          });
        }

        workoutMap.get(workout_id).exercises.push({
          id: exercise_id,
          name: exercise_name,
          repetitions: repetitions,
        });
      },
    );

    return Array.from(workoutMap.values());
  };

  const addExerciseField = () => {
    setExercises([...exercises, { name: "", repetitions: "" }]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const createWorkout = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    // If we're editing, update the workout instead of creating a new one
    if (isEditing && editingWorkoutId) {
      await updateWorkout();
      return;
    }

    const newWorkout = {
      name: newWorkoutName,
      exercises,
      userId: user.id,
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/workouts", newWorkout);

      setIsDialogOpen(false);
      setNewWorkoutName("");
      setExercises([{ name: "", repetitions: "" }]);

      await fetchUserWorkouts();
      alert("Workout created successfully!");
    } catch (error) {
      console.error("Error creating workout:", error);
      alert("Failed to create workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to set up editing a workout
  const editWorkout = (workout) => {
    // Set editing state
    setIsEditing(true);
    setEditingWorkoutId(workout.id);

    // Populate the form with the workout's data
    setNewWorkoutName(workout.name);
    setExercises(
      workout.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        repetitions: ex.repetitions,
      })),
    );

    // Open the dialog
    setIsDialogOpen(true);
  };

  // Function to update a workout
  const updateWorkout = async () => {
    try {
      setLoading(true);

      // 1. Update the workout name
      await axios.put(
        `http://localhost:3000/api/workouts/${editingWorkoutId}`,
        {
          name: newWorkoutName,
        },
      );

      // 2. Delete all existing exercise associations
      // We'll use a simpler approach: delete all and recreate
      const validExercises = exercises.filter(
        (ex) => ex.name.trim() !== "" && ex.repetitions,
      );

      // Create or update each exercise and associate them with the workout
      for (const exercise of validExercises) {
        try {
          let exerciseId;

          // If exercise has an ID, it already exists, so we'll update it
          if (exercise.id) {
            await axios.put(
              `http://localhost:3000/api/exercises/${exercise.id}`,
              {
                name: exercise.name,
                repetitions: exercise.repetitions,
              },
            );
            exerciseId = exercise.id;
          } else {
            // Otherwise create a new exercise
            const response = await axios.post(
              "http://localhost:3000/api/exercises",
              {
                name: exercise.name,
                repetitions: exercise.repetitions,
              },
            );
            exerciseId = response.data.id;
          }

          // Make sure the exercise is associated with the workout
          await axios.post("http://localhost:3000/api/workout_exercises", {
            workout_id: editingWorkoutId,
            exercise_id: exerciseId,
          });
        } catch (error) {
          console.error("Error processing exercise:", error);
        }
      }

      // 3. Refresh workouts list
      await fetchUserWorkouts();

      // 4. Reset form and state
      setNewWorkoutName("");
      setExercises([{ name: "", repetitions: "" }]);
      setIsDialogOpen(false);
      setIsEditing(false);
      setEditingWorkoutId(null);

      alert("Workout updated successfully!");
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("Failed to update workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectWorkout = async (workoutId) => {
    if (!user) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user_workouts",
        {
          userId: user.id,
          workoutId: workoutId,
        },
      );

      if (response.status === 200) {
        console.log("Workout already selected, no need to re-add.");
      } else {
        console.log("Workout added successfully.");
      }

      await fetchUserWorkouts();
    } catch (error) {
      console.error(
        "Error adding workout:",
        error.response?.data || error.message,
      );
    }
  };

  const fetchUserWorkouts = async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/user_workouts?userId=${user.id}`,
      );
      setUserWorkouts(response.data);

      if (response.data.length > 0) {
        const workoutIds = response.data.map((uw) => uw.workout_id);
        const workoutsResponse = await axios.get(
          `http://localhost:3000/api/workout_exercise_relation?userOnly=true&userId=${user.id}`,
        );
        setWorkouts(groupExercisesByWorkout(workoutsResponse.data));
      } else {
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Error fetching user workouts:", error);
    }
  };

  const removeExerciseField = (index) => {
    if (exercises.length > 1) {
      const updatedExercises = exercises.filter((_, i) => i !== index);
      setExercises(updatedExercises);
    }
  };

  const toggleWorkoutCompletion = async (workoutId) => {
    if (!user) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/completed_workouts",
        {
          userId: user.id,
          workoutId: workoutId,
          completedDate: selectedDate,
        },
      );

      // Refetch the completed workouts to update the UI
      fetchCompletedWorkouts();
    } catch (error) {
      console.error("Error toggling workout completion:", error);
    }
  };

  // Function to delete a workout
  const deleteWorkout = async (workoutId) => {
    try {
      setLoading(true);

      // Delete the workout
      await axios.delete(`http://localhost:3000/api/workouts/${workoutId}`);

      // Update the state by removing the deleted workout
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== workoutId),
      );

      // Update userWorkouts state
      setUserWorkouts((prevUserWorkouts) =>
        prevUserWorkouts.filter((uw) => uw.workout_id !== workoutId),
      );

      // Also remove from completedWorkouts if it was marked as completed
      setCompletedWorkouts((prevCompletedWorkouts) =>
        prevCompletedWorkouts.filter((cw) => cw.workout_id !== workoutId),
      );

      // Close the confirmation dialog
      setShowDeleteConfirm(null);

      // Show success message
      alert("Workout deleted successfully!");
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Failed to delete workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel form
  const handleCancelForm = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setEditingWorkoutId(null);
    setNewWorkoutName("");
    setExercises([{ name: "", repetitions: "" }]);
  };

  const isWorkoutCompleted = (workoutId) => {
    return completedWorkouts.some((cw) => cw.workout_id === workoutId);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="workout-page">
      <NavBar />

      <div className="workout-container">
        <div className="workout-header">
          <h1>Workout Library</h1>
          <p className="workout-subtitle">
            Explore our collection of workouts or create your own
          </p>

          <div className="workout-actions">
            <div className="date-picker-container">
              <label htmlFor="workout-date">Training Date:</label>
              <input
                type="date"
                id="workout-date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split("T")[0]} // Prevent selecting future dates
              />
            </div>

            <button
              className="create-workout-button"
              onClick={() => {
                setIsEditing(false);
                setEditingWorkoutId(null);
                setNewWorkoutName("");
                setExercises([{ name: "", repetitions: "" }]);
                setIsDialogOpen(true);
              }}
            >
              <span className="button-icon">+</span>
              Create New Workout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading workouts...</p>
          </div>
        ) : (
          <div className="workouts-grid">
            {workouts.map((workout) => (
              <div
                className={`workout-card ${isWorkoutCompleted(workout.id) ? "completed" : ""}`}
                key={workout.id}
              >
                <div className="workout-card-header">
                  <h3>{workout.name}</h3>
                  <div className="workout-header-actions">
                    <span className="exercise-count">
                      {workout.exercises.length} exercises
                    </span>
                    <div className="workout-action-buttons">
                      <button
                        className="edit-workout-button"
                        onClick={() => editWorkout(workout)}
                        title="Edit workout"
                      >
                        ✎
                      </button>
                      <button
                        className="delete-workout-button"
                        onClick={() => setShowDeleteConfirm(workout.id)}
                        title="Delete workout"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>

                <div className="workout-card-content">
                  <ul className="exercise-list">
                    {workout.exercises.map((exercise) => (
                      <li key={exercise.id}>
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-reps">
                          {exercise.repetitions} reps
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="workout-card-footer">
                  <div className="workout-buttons">
                    <button
                      onClick={() => selectWorkout(workout.id)}
                      className={`select-workout-button ${userWorkouts.some((uw) => uw.workout_id === workout.id) ? "selected" : ""}`}
                      disabled={userWorkouts.some(
                        (uw) => uw.workout_id === workout.id,
                      )}
                    >
                      {userWorkouts.some((uw) => uw.workout_id === workout.id)
                        ? "Added to My Workouts"
                        : "Add to My Workouts"}
                    </button>

                    <button
                      className={`completion-toggle ${isWorkoutCompleted(workout.id) ? "completed" : ""}`}
                      onClick={() => toggleWorkoutCompletion(workout.id)}
                      title={
                        isWorkoutCompleted(workout.id)
                          ? "Mark as incomplete"
                          : "Mark as completed"
                      }
                    >
                      {isWorkoutCompleted(workout.id) ? "✓" : ""}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog isOpen={isDialogOpen} onClose={handleCancelForm}>
        <div className="dialog-container">
          <h2 className="dialog-title">
            {isEditing ? "Edit Workout" : "Create a New Workout"}
          </h2>

          <div className="dialog-form">
            <div className="form-group">
              <label htmlFor="workout-name">Workout Name</label>
              <input
                id="workout-name"
                type="text"
                className="dialog-input"
                placeholder="e.g., Full Body Strength"
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
              />
            </div>

            <h3 className="dialog-subtitle">Exercises</h3>

            {exercises.map((exercise, index) => (
              <div key={index} className="exercise-input-group">
                <div className="form-group exercise-name-group">
                  <input
                    type="text"
                    className="dialog-input"
                    placeholder="Exercise Name"
                    value={exercise.name}
                    onChange={(e) =>
                      handleExerciseChange(index, "name", e.target.value)
                    }
                  />
                </div>

                <div className="form-group exercise-reps-group">
                  <input
                    type="number"
                    className="dialog-input"
                    placeholder="Reps"
                    value={exercise.repetitions}
                    onChange={(e) =>
                      handleExerciseChange(index, "repetitions", e.target.value)
                    }
                  />
                </div>

                <button
                  type="button"
                  className="remove-exercise-button"
                  onClick={() => removeExerciseField(index)}
                  disabled={exercises.length === 1}
                >
                  ×
                </button>
              </div>
            ))}

            <div className="dialog-buttons">
              <button
                className="dialog-button add-exercise"
                onClick={addExerciseField}
              >
                <span className="button-icon">+</span> Add Exercise
              </button>

              <button
                className="dialog-button create-workout"
                onClick={createWorkout}
                disabled={
                  !newWorkoutName ||
                  exercises.some((ex) => !ex.name || !ex.repetitions)
                }
              >
                {isEditing ? "Update Workout" : "Create Workout"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-dialog">
            <h3>Delete Workout</h3>
            <p>
              Are you sure you want to delete this workout? This action cannot
              be undone and will remove all associated exercises.
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
                onClick={() => deleteWorkout(showDeleteConfirm)}
              >
                Delete Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
