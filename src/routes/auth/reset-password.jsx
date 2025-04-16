import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import logoLight from "@/assets/main_logo.png";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { resetPassword, isLoading, error, setError } = useAuth();
    const navigate = useNavigate();
    const { token } = useParams();
    
    // Check if token exists
    useEffect(() => {
        if (!token) {
            navigate("/forgot-password");
        }
    }, [token, navigate]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        const success = await resetPassword(token, password);
        
        if (success) {
            setIsSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
    };
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex flex-col items-center">
                    <img src={logoLight} alt="RapidRoutines" className="h-12 mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
                    <p className="text-slate-500">
                        {isSuccess
                            ? "Your password has been reset successfully"
                            : "Create a new password for your account"}
                    </p>
                </div>
                
                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}
                
                {isSuccess ? (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center gap-2 rounded-lg bg-green-100 p-4 text-green-800">
                            <CheckCircle className="h-8 w-8" />
                            <p className="text-center">
                                Your password has been reset successfully. You will be redirected to the login page shortly.
                            </p>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-medium text-[#1e628c] hover:underline">
                                Back to login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-[#1e628c] py-2.5 text-center font-medium text-white hover:bg-[#17516f] focus:outline-none focus:ring-2 focus:ring-[#1e628c] focus:ring-offset-2 disabled:bg-[#1e628c]/70"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                        
                        <div className="text-center">
                            <Link to="/login" className="text-sm font-medium text-[#1e628c] hover:underline">
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;