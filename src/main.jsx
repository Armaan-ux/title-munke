// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/usercontext";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { ToastContainer } from "react-toastify";
// import { Buffer } from 'buffer'
// import process from 'process/browser'

// window.Buffer = Buffer
// window.process = process


const root = ReactDOM.createRoot(document.getElementById("root"));

if (!("aws_cloud_logic_custom" in awsconfig)) {
  awsconfig["aws_cloud_logic_custom"] = [{
    "name": "usersAdmin",
    "endpoint": "https://nz8vshfeah.execute-api.us-east-1.amazonaws.com/master",
    "region": "us-east-1",
    "authorizationType": "AMAZON_COGNITO_USER_POOLS",
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
