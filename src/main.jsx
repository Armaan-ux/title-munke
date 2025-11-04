// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/usercontext";
import { Amplify } from "aws-amplify";
// import awsconfig from "./aws-exports";
import { ToastContainer } from "react-toastify";
import { awsmobile as awsconfig } from "./aws-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Buffer } from 'buffer'
// import process from 'process/browser'

// window.Buffer = Buffer
// window.process = process

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById("root"));

console.log('awsconfig -', awsconfig);
if (!("aws_cloud_logic_custom" in awsconfig)) {
  awsconfig["aws_cloud_logic_custom"] = [{
    "name": "usersAdmin",
    "endpoint": "https://nz8vshfeah.execute-api.us-east-1.amazonaws.com/master",
    "region": "us-east-1",
    "authorizationType": "AMAZON_COGNITO_USER_POOLS",
  }];
}
Amplify.configure(awsconfig);
root.render(
  <>
  <QueryClientProvider client={queryClient} > 
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>
    </QueryClientProvider> 
  </>
);
