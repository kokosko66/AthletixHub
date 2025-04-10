import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="logo">
          <h1>AthletixHub</h1>
          <span className="logo-icon">💪</span>
        </div>
        <nav className="nav-links">
          <ul>
            <li>
              <Link
                className={`nav-link ${location.pathname === "/trainers" ? "active" : ""}`}
                to="/trainers"
              >
                Trainers
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${location.pathname === "/workouts" ? "active" : ""}`}
                to="/workouts"
              >
                Workouts
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${location.pathname === "/meals" ? "active" : ""}`}
                to="/meals"
              >
                Meals
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
                to="/profile"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
