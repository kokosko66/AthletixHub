import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import ChatPage from "../components/ChatPage";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutRequests, setWorkoutRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  // Workout history state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [workoutMonthData, setWorkoutMonthData] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [viewMode, setViewMode] = useState("day"); // 'day', 'week', 'month'

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // If the user is a trainer, fetch their pending workout requests
      if (parsedUser.role === "trainer") {
        fetchWorkoutRequests(parsedUser.id);
      }

      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchWorkoutDataForDate();
    }
  }, [user, selectedDate, viewMode]);

  // Fetch workout requests for the trainer
  const fetchWorkoutRequests = (trainerId) => {
    axios
      .get(
        `http://localhost:3000/api/workout_requests/trainer/${trainerId}/pending`,
      )
      .then((response) => {
        setWorkoutRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching workout requests:", error);
      });
  };

  // Function to fetch workout data for the selected date/range
  const fetchWorkoutDataForDate = async () => {
    if (!user) return;

    setLoadingWorkouts(true);

    try {
      let startDate, endDate;

      if (viewMode === "day") {
        // For day view, just use the selected date
        startDate = selectedDate.toISOString().split("T")[0];
        endDate = startDate;
      } else if (viewMode === "week") {
        // For week view, get the week's start (Sunday) and end (Saturday)
        const day = selectedDate.getDay();
        startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - day);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        startDate = startDate.toISOString().split("T")[0];
        endDate = endDate.toISOString().split("T")[0];
      } else if (viewMode === "month") {
        // For month view, get the month's start and end
        startDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1,
        );
        endDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          0,
        );

        startDate = startDate.toISOString().split("T")[0];
        endDate = endDate.toISOString().split("T")[0];
      }

      const response = await axios.get(
        `http://localhost:3000/api/completed_workouts/user/${user.id}/range?startDate=${startDate}&endDate=${endDate}`,
      );

      if (viewMode === "day") {
        setCompletedWorkouts(response.data);
      } else {
        // Process data for week or month view
        setWorkoutMonthData(response.data);
      }

      setLoadingWorkouts(false);
    } catch (error) {
      console.error("Error fetching workout data:", error);
      setLoadingWorkouts(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Delete account function
  const handleDeleteAccount = () => {
    if (!user) return;

    axios
      .delete(`http://localhost:3000/api/users/${user.id}`)
      .then(() => {
        // Remove user from local storage and redirect to register
        localStorage.removeItem("user");
        navigate("/register");
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      })
      .finally(() => {
        setShowDeleteConfirm(false);
      });
  };

  // Date navigation functions
  const goToPreviousDate = () => {
    if (viewMode === "day") {
      const prevDate = new Date(selectedDate);
      prevDate.setDate(selectedDate.getDate() - 1);
      setSelectedDate(prevDate);
    } else if (viewMode === "week") {
      const prevWeek = new Date(selectedDate);
      prevWeek.setDate(selectedDate.getDate() - 7);
      setSelectedDate(prevWeek);
    } else if (viewMode === "month") {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(selectedDate.getMonth() - 1);
      setSelectedDate(prevMonth);
    }
  };

  const goToNextDate = () => {
    // Don't allow navigating to future dates
    const today = new Date();

    if (viewMode === "day") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);
      if (nextDate <= today) {
        setSelectedDate(nextDate);
      }
    } else if (viewMode === "week") {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(selectedDate.getDate() + 7);
      if (nextWeek <= today) {
        setSelectedDate(nextWeek);
      }
    } else if (viewMode === "month") {
      const nextMonth = new Date(selectedDate);
      nextMonth.setMonth(selectedDate.getMonth() + 1);
      if (nextMonth <= today) {
        setSelectedDate(nextMonth);
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateRange = () => {
    if (viewMode === "day") {
      return formatDate(selectedDate);
    } else if (viewMode === "week") {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else if (viewMode === "month") {
      return selectedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  };

  // Function to render workout requests section (for trainers only)
  const renderWorkoutRequests = () => {
    if (!workoutRequests || workoutRequests.length === 0) {
      return <p>You have no pending workout requests.</p>;
    }

    return (
      <div className="workout-requests-list">
        {workoutRequests.map((request) => (
          <div className="workout-request-item" key={request.id}>
            <div className="request-user-info">
              <div className="request-user-avatar">
                {request.trainee_name && request.trainee_family_name
                  ? `${request.trainee_name.charAt(0)}${request.trainee_family_name.charAt(0)}`
                  : "U"}
              </div>
              <div className="request-user-details">
                <p className="request-user-name">
                  {request.trainee_name} {request.trainee_family_name}
                </p>
                <p className="request-date">
                  Requested: {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="request-actions">
              <button
                className="request-accept-btn"
                onClick={() => handleAcceptRequest(request.id)}
              >
                Accept
              </button>
              <button
                className="request-reject-btn"
                onClick={() => handleRejectRequest(request.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to handle workout request acceptance
  const handleAcceptRequest = (requestId) => {
    axios
      .put(`http://localhost:3000/api/workout_requests/${requestId}/status`, {
        status: "accepted",
      })
      .then((response) => {
        // Update the local state after successful acceptance
        setWorkoutRequests(
          workoutRequests.filter((request) => request.id !== requestId),
        );

        // Switch to the chat tab after accepting a request
        setActiveTab("chat");
      })
      .catch((error) => {
        console.error("Error accepting workout request:", error);
      });
  };

  // Function to handle workout request rejection
  const handleRejectRequest = (requestId) => {
    axios
      .put(`http://localhost:3000/api/workout_requests/${requestId}/status`, {
        status: "rejected",
      })
      .then((response) => {
        // Remove the rejected request from the list
        setWorkoutRequests(
          workoutRequests.filter((request) => request.id !== requestId),
        );
      })
      .catch((error) => {
        console.error("Error rejecting workout request:", error);
      });
  };

  // Render day view of completed workouts
  const renderDayWorkouts = () => {
    if (loadingWorkouts) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading workouts...</p>
        </div>
      );
    }

    if (completedWorkouts.length === 0) {
      return (
        <div className="no-workouts">
          <p>No workouts completed on this day.</p>
        </div>
      );
    }

    return (
      <div className="completed-workouts-list">
        {completedWorkouts.map((workout) => (
          <div className="completed-workout-item" key={workout.id}>
            <div className="completed-workout-info">
              <h3>{workout.workout_name}</h3>
              <p className="completion-time">
                Completed:{" "}
                {new Date(workout.completed_date).toLocaleDateString()}
              </p>
            </div>
            <div className="completion-badge">✓</div>
          </div>
        ))}
      </div>
    );
  };

  // Render week/month view of completed workouts
  const renderCalendarView = () => {
    if (loadingWorkouts) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading workouts...</p>
        </div>
      );
    }

    if (viewMode === "week") {
      // Group workouts by day of the week
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayStart = new Date(selectedDate);
      dayStart.setDate(dayStart.getDate() - dayStart.getDay()); // Start with Sunday

      return (
        <div className="week-view">
          {days.map((day, index) => {
            const currentDate = new Date(dayStart);
            currentDate.setDate(dayStart.getDate() + index);

            // Find workouts for this day
            const dayWorkouts = workoutMonthData.filter((workout) => {
              const workoutDate = new Date(workout.completed_date);
              return workoutDate.toDateString() === currentDate.toDateString();
            });

            return (
              <div
                key={day}
                className={`day-card ${dayWorkouts.length > 0 ? "has-workouts" : ""}`}
                onClick={() => {
                  setSelectedDate(currentDate);
                  setViewMode("day");
                }}
              >
                <div className="day-header">
                  <h3>{day}</h3>
                  <span className="day-date">{currentDate.getDate()}</span>
                </div>
                <div className="day-content">
                  {dayWorkouts.length > 0 ? (
                    <div className="day-workouts">
                      <span className="workout-count">
                        {dayWorkouts.length} workout(s)
                      </span>
                      <ul>
                        {dayWorkouts.slice(0, 3).map((workout) => (
                          <li key={workout.id}>{workout.workout_name}</li>
                        ))}
                        {dayWorkouts.length > 3 && (
                          <li className="more-workouts">
                            +{dayWorkouts.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="no-day-workouts">No workouts</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (viewMode === "month") {
      // Generate calendar for the month
      const firstDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
      );
      const lastDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
      );
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      // Group workouts by date
      const workoutsByDate = {};
      workoutMonthData.forEach((workout) => {
        const dateStr = workout.completed_date.split("T")[0];
        if (!workoutsByDate[dateStr]) {
          workoutsByDate[dateStr] = [];
        }
        workoutsByDate[dateStr].push(workout);
      });

      // Create calendar grid
      const days = [];
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null); // Empty cells for days before the 1st
      }

      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }

      return (
        <div className="month-view">
          <div className="calendar-header">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="calendar-grid">
            {days.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="calendar-day empty"
                  ></div>
                );
              }

              const currentDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                day,
              );
              const dateStr = currentDate.toISOString().split("T")[0];
              const dayWorkouts = workoutsByDate[dateStr] || [];

              return (
                <div
                  key={`day-${day}`}
                  className={`calendar-day ${dayWorkouts.length > 0 ? "has-workouts" : ""}`}
                  onClick={() => {
                    setSelectedDate(currentDate);
                    setViewMode("day");
                  }}
                >
                  <div className="calendar-day-number">{day}</div>
                  {dayWorkouts.length > 0 && (
                    <div className="calendar-workout-indicator">
                      <span>{dayWorkouts.length}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="profile-page">
        <NavBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <NavBar />
      {user ? (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name && user.family_name
                ? `${user.name.charAt(0)}${user.family_name.charAt(0)}`
                : "U"}
            </div>
            <div className="profile-info">
              <h1>
                {user.name} {user.family_name}
              </h1>
              <p className="profile-role">{user.role}</p>
              <p className="profile-email">{user.email}</p>
            </div>
            <div className="profile-actions">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
              <button
                className="delete-account-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Add tabs for Dashboard and Chat */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`profile-tab ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              Messages
            </button>
          </div>

          {activeTab === "dashboard" ? (
            // Dashboard content
            <div className="dashboard-container">
              <div className="dashboard-grid">
                {/* For trainers, show workout requests on top */}
                {user.role === "trainer" && (
                  <div className="dashboard-card workout-requests-card">
                    <h2>Workout Requests</h2>
                    {renderWorkoutRequests()}
                  </div>
                )}

                {/* Workout History Section */}
                <div className="dashboard-card workout-history-card">
                  <div className="workout-history-header">
                    <h2>Workout History</h2>
                    <div className="view-mode-selector">
                      <button
                        className={viewMode === "day" ? "active" : ""}
                        onClick={() => setViewMode("day")}
                      >
                        Day
                      </button>
                      <button
                        className={viewMode === "week" ? "active" : ""}
                        onClick={() => setViewMode("week")}
                      >
                        Week
                      </button>
                      <button
                        className={viewMode === "month" ? "active" : ""}
                        onClick={() => setViewMode("month")}
                      >
                        Month
                      </button>
                    </div>
                  </div>

                  <div className="date-navigation">
                    <button className="date-nav-btn" onClick={goToPreviousDate}>
                      &larr;
                    </button>
                    <h3 className="date-display">{formatDateRange()}</h3>
                    <button
                      className="date-nav-btn"
                      onClick={goToNextDate}
                      disabled={
                        viewMode === "day"
                          ? selectedDate.toDateString() ===
                            new Date().toDateString()
                          : false
                      }
                    >
                      &rarr;
                    </button>
                  </div>

                  <div className="workout-history-content">
                    {viewMode === "day"
                      ? renderDayWorkouts()
                      : renderCalendarView()}
                  </div>
                </div>

                {/* Stats card - can be used later for workout analytics */}
                <div className="dashboard-card workout-stats-card">
                  <h2>Workout Statistics</h2>
                  <div className="stats-container">
                    <div className="stat-item">
                      <div className="stat-circle">
                        <span className="stat-number">3</span>
                      </div>
                      <p>Workouts this week</p>
                    </div>
                    <div className="stat-item">
                      <div className="stat-circle">
                        <span className="stat-number">12</span>
                      </div>
                      <p>Workouts this month</p>
                    </div>
                    <div className="stat-item">
                      <div className="stat-circle">
                        <span className="stat-number">87%</span>
                      </div>
                      <p>Completion rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat content
            <div className="chat-container-wrapper">
              <ChatPage currentUser={user} />
            </div>
          )}
        </div>
      ) : (
        <div className="user-container">
          <p>Loading user data...</p>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-dialog">
            <h3>Delete Account</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="delete-confirmation-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
