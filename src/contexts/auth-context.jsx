import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Create context
const AuthContext = createContext({});

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set up axios defaults - don't add "/api" here
    useEffect(() => {
        axios.defaults.baseURL = window.location.origin;
        
        // Add interceptor to handle 401s
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];
                    setUser(null);
                    setIsAuthenticated(false);
                }
                return Promise.reject(error);
            }
        );
        
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    // Load user from token
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
                
                // Get user data
                const res = await axios.get("/api/auth/user");
                
                if (res.data?.user) {
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

    // Login
    const login = async (email, password) => {
        try {
            setError(null);
            setIsLoading(true);
            
            const res = await axios.post("/api/auth/login", { email, password });
            
            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
                setUser(res.data.user);
                setIsAuthenticated(true);
                return true;
            }
            
            return false;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Signup
    const signup = async (name, email, password) => {
        try {
            setError(null);
            setIsLoading(true);
            
            const res = await axios.post("/api/auth/register", { name, email, password });
            
            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
                setUser(res.data.user);
                setIsAuthenticated(true);
                return true;
            }
            
            return false;
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Update profile
    const updateProfile = async (userData) => {
        try {
            setError(null);
            setIsLoading(true);
            
            const res = await axios.put("/api/auth/update-profile", userData);
            
            if (res.data?.user) {
                setUser(res.data.user);
                return true;
            }
            
            return false;
        } catch (err) {
            setError(err.response?.data?.message || "Profile update failed");
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
            setError(err.response?.data?.message || "Error sending reset email");
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
            setError(err.response?.data?.message || "Password reset failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsAuthenticated(false);
    };

    // Auth context values
    const value = {
        user,
        isAuthenticated,
        isLoading,
        error,
        setError,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook for using the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    
    return context;
};

export default AuthContext;
