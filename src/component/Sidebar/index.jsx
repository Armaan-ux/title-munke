import { useUser } from "../../context/usercontext";
import { routes } from "../../sidebarRoutes";
import { NavLink } from "react-router-dom";
import "./index.css";

function Sidebar() {
  const { user, signOut } = useUser();

  const userGroups =
    user?.signInUserSession?.idToken?.payload["cognito:groups"];
  const userRole = userGroups?.[0];

  const roleRoutes = routes[userRole] || [];

  return (
    <div className="sidebar">
      <h2 className="logo">
        Title Munke <span>🐒</span>
      </h2>
      <nav className="nav-links">
        {roleRoutes.map((route, index) => (
          <NavLink
            key={index}
            to={route.link}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i style={{ marginRight: "4px" }} className={route.class}></i>
            {route.name}
          </NavLink>
        ))}
      </nav>
      <button className="logout" onClick={signOut}>
        <i className="fas fa-right-from-bracket"></i>Logout
      </button>
    </div>
  );
}

export default Sidebar;
