import React from "react";
import Login from "./component/Login";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import NotFound from "./component/NotFound";
import ProtectedRoute from "./component/ProtectedRoute";
import { adminRoutes, agentRoutes, brokerRoutes } from "./routes";
import Layout from "./component/Layout";
import { useUser } from "./context/usercontext";
import Loader from "./component/Loader";
import ForgetPassword from "./component/ForgetPassword";

function App() {
  const { isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/" element={<Layout />}>
          {adminRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute allowedGroups={["admin"]}>
                  <Component />
                </ProtectedRoute>
              }
            />
          ))}

          {agentRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute allowedGroups={["agent"]}>
                  <Component />
                </ProtectedRoute>
              }
            />
          ))}

          {brokerRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute allowedGroups={["broker"]}>
                  <Component />
                </ProtectedRoute>
              }
            />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
    </Router>
  );
}

export default App;
