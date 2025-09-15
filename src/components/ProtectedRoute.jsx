import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/usercontext';

const ProtectedRoute = ({ children, allowedGroups }) => {
    const { user } = useUser();
    if (!user) {
        // If the user is not logged in, redirect to the login page
        return <Navigate to="/login" />;
    }

    const userGroups = user?.signInUserSession?.idToken?.payload['cognito:groups'] || [];

    if (!allowedGroups.some((group) => userGroups.includes(group))) {
        // If the user is logged in but not authorized for this route, redirect to NotFound
        return <Navigate to="/notfound" />;
    }

    // If the user is authorized, render the children
    return children;
};

export default ProtectedRoute;
