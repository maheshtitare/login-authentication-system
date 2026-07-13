import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (

    <div className="dashboard">

      <nav className="dashboard-nav">

        <div></div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

      <div className="dashboard-content">

        <div className="dashboard-card">

          <h1>Welcome</h1>

          <p>
            You have successfully logged in.
          </p>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;