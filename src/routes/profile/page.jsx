import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useChatbot } from "@/contexts/chatbot-context";
import { useExercises } from "@/contexts/exercise-context";
import { useSavedExercises } from "@/contexts/saved-exercises-context";
import { Footer } from "@/layouts/footer";
import { User, Mail, Clock, LogOut, Save, CheckCircle, RefreshCw, AlertCircle, Database } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

const ProfilePage = () => {
    const { user, logout, isAuthenticated, updateProfile } = useAuth();
    const { getChatHistory, syncChatHistoryWithCloud, deleteAllChatSessions } = useChatbot();
    const { getExercises, syncExercisesWithCloud, deleteAllExercises } = useExercises();
    const { savedExercises, syncSavedExercisesWithCloud } = useSavedExercises();
    
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("profile");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    
    // Get data counts for display
    const chatHistoryCount = getChatHistory().length;
    const exercisesCount = getExercises().length;
    const savedExercisesCount = savedExercises.length;
    
    // Check for tab parameter in URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get('tab');
        if (tabParam === 'settings') {
            setActiveTab('settings');
        }
    }, [location]);
    
    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setDisplayName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);
    
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Function to save profile changes
    const saveProfileChanges = async () => {
        // Validate inputs
        if (!displayName.trim()) {
            setErrorMessage("Display name cannot be empty");
            return;
        }
        
        if (!email.trim() || !email.includes('@')) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        
        // Create updated user object
        const userData = {
            name: displayName,
            email: email
        };
        
        // Update user data
        const success = await updateProfile(userData);
        
        if (success) {
            // Show success message and exit edit mode
            setSuccessMessage("Profile updated successfully!");
            setIsEditing(false);
            setErrorMessage("");
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        }
    };
    
    // Function to sync all data with the cloud
    const syncAllData = async () => {
        if (!isAuthenticated) {
            setErrorMessage("You must be logged in to sync data");
            return;
        }
        
        setIsSyncing(true);
        
        try {
            // Sync all data types in parallel
            await Promise.all([
                syncChatHistoryWithCloud(),
                syncExercisesWithCloud(),
                syncSavedExercisesWithCloud()
            ]);
            
            setSuccessMessage("All data synchronized successfully!");
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            console.error("Error syncing data:", error);
            setErrorMessage("Error synchronizing data. Please try again.");
            
            // Clear error message after 3 seconds
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        } finally {
            setIsSyncing(false);
        }
    };
    
    // Function to clear chatbot history
    const clearChatbotHistory = () => {
        if (confirm("Are you sure you want to clear all your chatbot history? This cannot be undone.")) {
            try {
                // Delete all chat sessions
                deleteAllChatSessions();
                
                // Show success message
                setSuccessMessage("Chatbot history cleared successfully!");
                
                // Clear message after timeout
                setTimeout(() => {
                    setSuccessMessage("");
                }, 2000);
            } catch (error) {
                console.error("Error clearing chatbot history:", error);
                setErrorMessage("Error clearing chatbot history. Please try again.");
                
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            }
        }
    };
    
    // Function to clear exercise history
    const clearExerciseHistory = () => {
        if (confirm("Are you sure you want to clear your exercise history? This cannot be undone.")) {
            try {
                // Delete all exercises
                deleteAllExercises();
                
                // Show success message
                setSuccessMessage("Exercise history cleared successfully!");
                
                // Clear message after timeout
                setTimeout(() => {
                    setSuccessMessage("");
                }, 2000);
            } catch (error) {
                console.error("Error clearing exercise history:", error);
                setErrorMessage("Error clearing exercise history. Please try again.");
                
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            }
        }
    };
    
    // Function to clear saved exercises
    const clearSavedExercises = () => {
        if (confirm("Are you sure you want to clear all saved exercises? This cannot be undone.")) {
            try {
                // Use the savedExercises context to clear
                const updatedSavedExercises = [];
                localStorage.setItem("savedExercises_data", JSON.stringify(updatedSavedExercises));
                
                // Show success message
                setSuccessMessage("Saved exercises cleared successfully!");
                
                // Clear message and reload after timeout
                setTimeout(() => {
                    setSuccessMessage("");
                    window.location.reload();
                }, 1500);
            } catch (error) {
                console.error("Error clearing saved exercises:", error);
                setErrorMessage("Error clearing saved exercises. Please try again.");
                
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            }
        }
    };
    
    // Function to delete account and all data
    const deleteAccount = () => {
        if (confirm("Are you sure you want to delete your account and all associated data? This action cannot be undone.")) {
            try {
                // Clear all user data
                localStorage.removeItem("savedExercises_data");
                localStorage.removeItem("exercises_data");
                localStorage.removeItem("chatbot_history_data");
                localStorage.removeItem("token");
                
                setSuccessMessage("Account deleted successfully. Redirecting...");
                setTimeout(() => {
                    logout();
                    navigate("/");
                }, 2000);
            } catch (error) {
                console.error("Error deleting account:", error);
                setErrorMessage("Error deleting account. Please try again.");
                
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            }
        }
    };
    
    if (!isAuthenticated) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h1 className="title mb-4">Profile</h1>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-10 text-center">
                    <User className="mb-3 h-16 w-16 text-slate-400" />
                    <h2 className="mb-2 text-xl font-semibold text-slate-800">Sign in to view your profile</h2>
                    <p className="mb-6 text-slate-600">Create an account or sign in to access all features</p>
                    <div className="flex gap-4">
                        <Link 
                            to="/login" 
                            className="rounded-lg bg-[#1e628c] px-4 py-2 font-medium text-white hover:bg-[#17516f]"
                        >
                            Sign In
                        </Link>
                        <Link 
                            to="/signup" 
                            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-y-6">
            <h1 className="title">Your Account</h1>
            
            {/* Success Message */}
            {successMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span>{successMessage}</span>
                </div>
            )}
            
            {/* Error Message */}
            {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span>{errorMessage}</span>
                </div>
            )}
            
            <div className="flex flex-col gap-4 md:flex-row">
                {/* Sidebar/Tabs */}
                <div className="w-full rounded-lg bg-white p-4 shadow-md md:w-64 md:flex-shrink-0">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium",
                                activeTab === "profile" 
                                    ? "bg-[#1e628c] text-white" 
                                    : "text-slate-700 hover:bg-slate-100"
                            )}
                        >
                            <User className="h-5 w-5" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium",
                                activeTab === "settings" 
                                    ? "bg-[#1e628c] text-white" 
                                    : "text-slate-700 hover:bg-slate-100"
                            )}
                        >
                            <Save className="h-5 w-5" />
                            Saved Data
                        </button>
                    </nav>
                    
                    {/* Sync button */}
                    {isAuthenticated && (
                        <div className="mt-4">
                            <button
                                onClick={syncAllData}
                                disabled={isSyncing}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSyncing ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    <>
                                        <Database className="h-4 w-4" />
                                        Sync All Data
                                    </>
                                )}
                            </button>
                            
                            <div className="mt-2 text-center text-xs text-slate-500">
                                {isAuthenticated ? "Your data syncs automatically" : "Sign in to sync your data"}
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-6 border-t border-slate-200 pt-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
                                <button 
                                    onClick={() => setIsEditing(prev => !prev)}
                                    className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </button>
                            </div>
                            
                            {isEditing ? (
                                // Edit Mode
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full rounded-md border border-slate-300 p-2 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        />
                                    </div>
                                    
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-md border border-slate-300 p-2 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        />
                                    </div>
                                    
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500">Last Login</h3>
                                                <p className="font-medium text-slate-900">
                                                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Just now"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <button 
                                            onClick={saveProfileChanges}
                                            className="rounded-lg bg-[#1e628c] px-4 py-2 font-medium text-white hover:bg-[#17516f]"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500">Display Name</h3>
                                                <p className="font-medium text-slate-900">{displayName || "Not provided"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500">Email Address</h3>
                                                <p className="font-medium text-slate-900">{email || "No email found"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500">Last Login</h3>
                                                <p className="font-medium text-slate-900">
                                                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Just now"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Data Summary */}
                            <div className="mt-8">
                                <h3 className="mb-4 text-lg font-medium text-slate-800">Your Data Summary</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="rounded-lg border border-slate-200 p-4 text-center">
                                        <div className="text-2xl font-bold text-[#1e628c]">{savedExercisesCount}</div>
                                        <div className="text-sm text-slate-600">Saved Exercises</div>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-4 text-center">
                                        <div className="text-2xl font-bold text-[#1e628c]">{exercisesCount}</div>
                                        <div className="text-sm text-slate-600">Exercise Logs</div>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 p-4 text-center">
                                        <div className="text-2xl font-bold text-[#1e628c]">{chatHistoryCount}</div>
                                        <div className="text-sm text-slate-600">Chat Sessions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div>
                            <h2 className="mb-6 text-xl font-semibold text-slate-800">Data Management</h2>
                            
                            <div className="space-y-6">
                                <div className="rounded-lg border border-slate-200 p-5">
                                    <h3 className="mb-1 font-medium text-slate-900">Saved Exercises</h3>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Manage exercises you've saved to your library ({savedExercisesCount} {savedExercisesCount === 1 ? 'exercise' : 'exercises'})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            to="/library"
                                            className="rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#17516f]"
                                        >
                                            View Saved Exercises
                                        </Link>
                                        <button 
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={savedExercisesCount === 0}
                                            onClick={clearSavedExercises}
                                        >
                                            Clear All Saved Exercises
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Chatbot History Section */}
                                <div className="rounded-lg border border-slate-200 p-5">
                                    <h3 className="mb-1 font-medium text-slate-900">Chatbot History</h3>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Manage your saved chat conversations ({chatHistoryCount} {chatHistoryCount === 1 ? 'conversation' : 'conversations'})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            to="/chatbot"
                                            className="rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#17516f]"
                                        >
                                            Go to Chatbot
                                        </Link>
                                        <button 
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            onClick={clearChatbotHistory}
                                            disabled={chatHistoryCount === 0}
                                        >
                                            Clear All Chat History
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="rounded-lg border border-slate-200 p-5">
                                    <h3 className="mb-1 font-medium text-slate-900">Exercise History</h3>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Manage your exercise tracking history ({exercisesCount} {exercisesCount === 1 ? 'record' : 'records'})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            to="/"
                                            className="rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#17516f]"
                                        >
                                            View Exercise History
                                        </Link>
                                        <button 
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={exercisesCount === 0}
                                            onClick={clearExerciseHistory}
                                        >
                                            Clear Exercise History
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="rounded-lg border border-slate-200 p-5">
                                    <h3 className="mb-1 font-medium text-slate-900">Account Data</h3>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Manage all data associated with your account
                                    </p>
                                    <button 
                                        className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                        onClick={deleteAccount}
                                    >
                                        Delete Account & All Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default ProfilePage;