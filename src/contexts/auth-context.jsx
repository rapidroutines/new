import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Create the auth context with default values
const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: () => {},
    signup: () => {},
    logout: () => {},
    isLoading: true,
    forgotPassword: () => {},
    resetPassword: () => {},
    updateProfile: () => {},
    error: null,
    setError: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set up axios defaults and interceptors
    useEffect(() => {
        // Add axios interceptor to handle expired tokens
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    // If we get a 401, clear the token and log the user out
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];
                    setUser(null);
                    setIsAuthenticated(false);
                }
                return Promise.reject(error);
            }
        );
        
        return () => {
            // Clean up interceptor on unmount
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    // Load user from token on initial render
    useEffect(() => {
        const loadUser = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                
                if (!token) {
                    setIsLoading(false);
                    return;
                }
                
                // Set auth header
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                
                // Verify token and get user data
                const res = await axios.get("/api/auth/user");
                
                if (res.data && res.data.user) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Error loading user:", err);
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login user
    const login = async (email, password) => {
        try {
            setError(null);
            setIsLoading(true);
            
            const res = await axios.post("/api/auth/login", { email, password });
            
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
                setUser(res.data.user);
                setIsAuthenticated(true);
                return true;
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Register user
    const signup = async (name, email, password) => {
        try {
            setError(null);
            setIsLoading(true);
            
            const res = await axios.post("/api/auth/register", { name, email, password });
            
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
                setUser(res.data.user);
                setIsAuthenticated(true);
                return true;
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            setError(null);
            setIsLoading(true);
            
            const res = await axios.put("/api/auth/update-profile", userData);
            
            if (res.data.user) {
                setUser(res.data.user);
                return true;
            }
        } catch (err) {
            setError(err.response?.data?.message || "Profile update failed. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Forgot password
    const forgotPassword = async (email) => {
        try {
            setError(null);
            setIsLoading(true);
            
            await axios.post("/api/auth/forgot-password", { email });
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Reset password
    const resetPassword = async (token, password) => {
        try {
            setError(null);
            setIsLoading(true);
            
            await axios.post("/api/auth/reset-password", { token, password });
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                signup,
                logout,
                forgotPassword,
                resetPassword,
                updateProfile,
                error,
                setError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    
    return context;
};