import { useUser } from '../../context/usercontext';
import { routes } from '../../sidebarRoutes';
import { NavLink } from "react-router-dom";
import './index.css';


function Sidebar() {
    const { user } = useUser();

    // Extract user role from the Cognito group
    const userGroups = user?.signInUserSession?.idToken?.payload["cognito:groups"];
    const userRole = userGroups?.[0]; // Assuming the first group represents the primary role

    // Get the routes for the current role
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
                        {route.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default Sidebar;