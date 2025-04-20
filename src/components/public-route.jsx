import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import PropTypes from "prop-types"; 
import Layout from "@/routes/layout";

export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-100">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1e628c] border-t-transparent"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <Layout>
            {children}
        </Layout>
    );
};

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
