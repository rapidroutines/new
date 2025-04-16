import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import PropTypes from "prop-types";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state if still checking authentication
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-100">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1e628c] border-t-transparent"></div>
            </div>
        );
    }

    // If not authenticated, redirect to sign-in with return URL
    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
    }

    // If authenticated, render the protected content
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};