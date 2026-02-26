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
  organisationRoutes,
} from "./routes";
import Layout from "./components/Layout";
import { useUser } from "./context/usercontext";
import ForgetPassword from "./components/ForgetPassword";
import Home from "./components/Home";
import ContactUs from "./components/Contactus";
import Register from "./components/register";
import RegisterIndividual from "./components/register-individual";
import OrganizationRoleOverview from "./components/viewMore";
import Pricing from "./components/Pricing";
import SubscriptionLogin from "./components/SubscriptionLogin";
import SubscriptionPayment from "./components/common/SubscriptionPayment";
import SubscriptionSignup from "./components/SubscriptionSignup";
import SubscriptionCardDetails from "./components/common/SubscriptionCardDetails";
import SubscriptionAddAgent from "./components/SubscriptionAddAgent/Index";
import SubscriptionAddBroker from "./components/SubscriptionAddBroker";
import SubscriptionAddOrdAgent from "./components/SubscriptionAddOrgAgent";

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
      <Route path="/subscription-signup/:userType/:planId" element={<SubscriptionSignup />} />
      <Route path="/subscription-login" element={<SubscriptionLogin />} />
      <Route path="/subscription-addAgent/:planId" element={<SubscriptionAddAgent />} />
      <Route path="/subscription-addBroker/:planId" element={<SubscriptionAddBroker />} />
      <Route path="/subscription-addOrgAgent/:planId" element={<SubscriptionAddOrdAgent />} />
      <Route path="/subscription-payment/:planId" element={<SubscriptionPayment />} />
      <Route
        path="/subscription-card-details/:planId"
        element={<SubscriptionCardDetails />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/register/individual" element={<RegisterIndividual />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/pricing" element={<Pricing />} />
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
        {organisationRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedGroups={["organisation"]}>
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
      <Route path="*" element={<NotFound />} />
    </Routes>
    // </Router>
  );
}

export default App;
