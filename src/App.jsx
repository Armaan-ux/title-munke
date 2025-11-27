import React from "react";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  adminRoutes,
  agentRoutes,
  brokerRoutes,
  individualRoutes,
} from "./routes";
import Layout from "./components/Layout";
import { useUser } from "./context/usercontext";
import ForgetPassword from "./components/ForgetPassword";
import Home from "./components/Home";
import ContactUs from "./components/Contactus";
import Register from "./components/register";
import RegisterIndividual from "./components/register-individual";
import OrganizationRoleOverview from "./components/viewMore";

function App() {
  const { isLoading } = useUser();

  if (isLoading) {
    // return <Loader />;
    return null;
  }

  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/viewmore" element={<OrganizationRoleOverview />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/individual" element={<RegisterIndividual />} />
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
          {individualRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                // <ProtectedRoute allowedGroups={["individual"]}>
                  <Component />
                // </ProtectedRoute>
              }
            />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
    // </Router>
  );
}

export default App;
