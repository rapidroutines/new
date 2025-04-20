import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import logoLight from "@/assets/main_logo.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { login, isLoading, error, setError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        setError(null);
        setEmailError("");
        setPasswordError("");
    }, [email, password, setError]);
    
    const from = location.state?.from || "/";
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError(null);
        setEmailError("");
        setPasswordError("");
        
        if (!email.trim()) {
            setEmailError("Email is required");
            return;
        }
        
        if (!password) {
            setPasswordError("Password is required");
            return;
        }
        
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            const result = await login(email.trim(), password);
            
            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", email.trim());
                } else {
                    localStorage.removeItem("rememberedEmail");
                }
                
                navigate(from, { replace: true });
            } else {
                if (result.errorType === "user_not_found") {
                    setEmailError("Account not found.");
                } else if (result.errorType === "invalid_password") {
                    setPasswordError("Incorrect password. Please try again.");
                } else {
                    setError(result.message || "Login failed");
                }
            }
        } catch (err) {
            console.error("Login error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex flex-col items-center">
                    <img src={logoLight} alt="RapidRoutines" className="h-12 mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                    <p className="text-slate-500">Sign in to your account</p>
                </div>
                
                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full rounded-lg border ${
                                emailError ? 'border-red-300' : 'border-slate-300'
                            } p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]`}
                            placeholder="your@email.com"
                            disabled={isSubmitting}
                        />
                        {emailError && (
                            <p className="mt-1 text-xs text-red-600">{emailError}</p>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full rounded-lg border ${
                                    passwordError ? 'border-red-300' : 'border-slate-300'
                                } p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]`}
                                placeholder="••••••••"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="mt-1 text-xs text-red-600">{passwordError}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-[#1e628c]"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-slate-600">
                                Remember me
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-[#1e628c] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="w-full rounded-lg bg-[#1e628c] py-2.5 text-center font-medium text-white hover:bg-[#17516f] focus:outline-none focus:ring-2 focus:ring-[#1e628c] focus:ring-offset-2 disabled:bg-[#1e628c]/70"
                    >
                        {isSubmitting || isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Signing in...
                            </span>
                        ) : "Sign in"}
                    </button>
                    
                    <p className="text-center text-sm text-slate-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-medium text-[#1e628c] hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
