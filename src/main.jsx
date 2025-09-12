// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/usercontext";
import { Amplify } from "aws-amplify";
// import awsconfig from "./aws-exports";
import { awsmobile } from "./aws-exports";
import { ToastContainer } from "react-toastify";
// import { Buffer } from 'buffer'
// import process from 'process/browser'

// window.Buffer = Buffer
// window.process = process


const root = ReactDOM.createRoot(document.getElementById("root"));

console.log('awsconfig --> ', awsmobile);
if (!("aws_cloud_logic_custom" in awsmobile)) {
  awsmobile["aws_cloud_logic_custom"] = [{
    "name": "usersAdmin",
    "endpoint": "https://nz8vshfeah.execute-api.us-east-1.amazonaws.com/master",
    "region": "us-east-1",
    "authorizationType": "AMAZON_COGNITO_USER_POOLS",
  }];
}
Amplify.configure(awsmobile);
root.render(
  <>
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>
  </>
);
