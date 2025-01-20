import React from "react";
import "./App.css";
import Login from "./component/Login";
import { getCurrentUser } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

Amplify.configure(awsconfig);

const AdminPage = () => <h2>Admin Dashboard</h2>;
const UserPage = () => <h2>User Dashboard</h2>;

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const initialCall = async () => {
      const { username } = await getCurrentUser();
      setUser(!!username);
    };

    initialCall();
  }, []);
  console.log("user");
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            user &&
            user.signInUserSession.idToken.payload["cognito:groups"]?.includes(
              "Admin"
            ) ? (
              <AdminPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/user"
          element={
            user &&
            user.signInUserSession.idToken.payload["cognito:groups"]?.includes(
              "User"
            ) ? (
              <UserPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={user.groups.includes("Admin") ? "/admin" : "/user"}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
