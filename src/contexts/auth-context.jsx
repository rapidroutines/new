import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.defaults.baseURL = window.location.origin;
        
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

    useEffect(() => {
        const loadUser = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                
                if (!token) {
                    setIsLoading(false);
                    return;
                }
                
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                
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
            return { success: true };
            }
        
            return { success: false, message: "Login failed" };
        } catch (err) {
            let errorType = "unknown";
            let errorMessage = err.response?.data?.message || "Login failed";
        
            if (err.response?.status === 400) {
                if (errorMessage.includes("Invalid credentials")) {
                    if (err.response?.data?.details?.field === "email") {
                        errorType = "user_not_found";
                    } else if (err.response?.data?.details?.field === "password") {
                        errorType = "invalid_password";
                    }
                }
            }
        
            setError(errorMessage);
        
            return { 
                success: false, 
                message: errorMessage,
                errorType: errorType
            };
        } finally {
            setIsLoading(false);
        }
    };

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

    const deleteAccount = async () => {
        try {
            setError(null);
            setIsLoading(true);
            
            const res = await axios.delete("/api/auth/delete-account");
            
            if (res.status === 200) {
                localStorage.removeItem("savedExercises_data");
                localStorage.removeItem("exercises_data");
                localStorage.removeItem("chatbot_history_data");
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
                setUser(null);
                setIsAuthenticated(false);
                return true;
            }
            
            return false;
        } catch (err) {
            setError(err.response?.data?.message || "Account deletion failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsAuthenticated(false);
    };

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
        updateProfile,
        deleteAccount
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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

export default AuthContext;
