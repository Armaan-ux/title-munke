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
import ForgetPassword from "./component/ForgetPassword";
import Home from "./component/Home";
import ContactUs from "./component/Contactus";
import awsconfig from "./aws-exports";

function App() {
  const { isLoading } = useUser();
  console.log('config --- ', awsconfig);
  if (isLoading) {
    // return <Loader />;
    return null
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contactus" element={<ContactUs />} />
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
