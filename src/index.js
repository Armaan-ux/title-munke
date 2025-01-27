import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/usercontext";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { ToastContainer } from "react-toastify";
const root = ReactDOM.createRoot(document.getElementById("root"));

Amplify.configure(awsconfig);
root.render(
  <>
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>
  </>
);
