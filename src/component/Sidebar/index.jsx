import { useUser } from "../../context/usercontext";
import { routes } from "../../sidebarRoutes";
import { NavLink } from "react-router-dom";
import logo from "../../img/Logo.svg";
import "./index.css";

function Sidebar() {
  const { user, signOut } = useUser();

  const userGroups =
    user?.signInUserSession?.idToken?.payload["cognito:groups"];
  const userRole = userGroups?.[0];

  const roleRoutes = routes[userRole] || [];

  return (
    <div className="sidebar">
      <div
        style={{
          background: "#ffffff",
          height: "85px",
          padding: "0",
          width: "288px",
          position: "fixed",
          top: "0",
          left: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span>
          <img src={logo} className="logoimg" />
        </span>
        <h2 className="logo">Title Munke </h2>
      </div>
      <nav className="nav-links" style={{ position: "absolute", top: "100px" }}>
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
