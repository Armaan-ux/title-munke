import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/usercontext";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { ToastContainer } from "react-toastify";
const root = ReactDOM.createRoot(document.getElementById("root"));

if (!("aws_cloud_logic_custom" in awsconfig)) {
  awsconfig["aws_cloud_logic_custom"] = [{
    "name": "usersAdmin",
    "endpoint": "https://rvz67ef1yc.execute-api.us-east-1.amazonaws.com/master",
    "region": "us-east-1"
  }];
}
console.log('awsconfig:', awsconfig);
Amplify.configure(awsconfig);
root.render(
  <>
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>
  </>
);
