import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useSelector((state) => state.auth);

    // Check if the user is not logged in or doesn't have the required role
    if (!user || (role && user.role !== role)) {
        // Redirect to login page or an unauthorized page
        return <Navigate to="/login" replace />;
    }

    // If the user is authenticated and has the correct role, render the children
    return children;
};

export default ProtectedRoute;