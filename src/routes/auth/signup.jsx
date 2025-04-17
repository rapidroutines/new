import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Info } from "lucide-react";
import logoLight from "@/assets/main_logo.png";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const { signup, error, setError, isLoading } = useAuth();
    const navigate = useNavigate();
    
    // Clear auth context error when component mounts or inputs change
    useEffect(() => {
        setError(null);
    }, [name, email, password, confirmPassword, setError]);
    
    // Password strength and validation
    const validatePassword = (password) => {
        // Check for empty password
        if (!password) return { valid: false, message: "Password is required" };
        
        // Check minimum length
        if (password.length < 6) {
            return { valid: false, message: "Password must be at least 6 characters" };
        }
        
        // For stronger validation you could check for:
        // - Uppercase letters
        // - Lowercase letters
        // - Numbers
        // - Special characters
        
        return { valid: true, message: "Password is valid" };
    };
    
    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, text: "" };
        
        if (password.length < 6) return { strength: 1, text: "Weak" };
        if (password.length < 10) return { strength: 2, text: "Medium" };
        return { strength: 3, text: "Strong" };
    };
    
    const passwordStrength = getPasswordStrength();
    
    // Form validation
    const validateForm = () => {
        const errors = {};
        
        if (!name.trim()) {
            errors.name = "Name is required";
        }
        
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errors.email = "Please enter a valid email address";
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            errors.password = passwordValidation.message;
        }
        
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        
        if (!termsAccepted) {
            errors.terms = "You must accept the Terms of Service";
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset errors
        setError(null);
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Prevent multiple submissions
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            const success = await signup(name.trim(), email.trim(), password);
            
            if (success) {
                navigate("/");
            }
        } catch (err) {
            console.error("Signup error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex flex-col items-center">
                    <img src={logoLight} alt="RapidRoutines" className="h-12 mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
                    <p className="text-slate-500">Sign up to get started</p>
                </div>
                
                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full rounded-lg border ${
                                validationErrors.name ? 'border-red-300' : 'border-slate-300'
                            } p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]`}
                            placeholder="Your name"
                            disabled={isSubmitting}
                        />
                        {validationErrors.name && (
                            <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
                        )}
                    </div>
                    
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
                                validationErrors.email ? 'border-red-300' : 'border-slate-300'
                            } p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]`}
                            placeholder="your@email.com"
                            disabled={isSubmitting}
                        />
                        {validationErrors.email && (
                            <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
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
                                    validationErrors.password ? 'border-red-300' : 'border-slate-300'
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
                        {validationErrors.password && (
                            <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
                        )}
                        
                        {/* Password strength indicator */}
                        {password && (
                            <div className="mt-2">
                                <div className="mb-1 flex gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full ${
                                                level <= passwordStrength.strength
                                                    ? level === 1
                                                        ? "bg-red-500"
                                                        : level === 2
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                    : "bg-slate-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs ${
                                    passwordStrength.strength === 1
                                        ? "text-red-600"
                                        : passwordStrength.strength === 2
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                }`}>
                                    {passwordStrength.text}
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full rounded-lg border ${
                                validationErrors.confirmPassword ? 'border-red-300' : 'border-slate-300'
                            } p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]`}
                            placeholder="••••••••"
                            disabled={isSubmitting}
                        />
                        {validationErrors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
                        )}
                        {password && confirmPassword && password === confirmPassword && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                <span>Passwords match</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className={`h-4 w-4 rounded border ${
                                    validationErrors.terms ? 'border-red-300' : 'border-slate-300'
                                } text-[#1e628c]`}
                                disabled={isSubmitting}
                            />
                        </div>
                        <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                            I agree to the{" "}
                            <a 
                                href="https://docs.google.com/document/d/18YQf-p_lAWLWkv4xXltvtJMY8fW0MRn5ur2BUNjhdHE/edit?tab=t.lx86jybafkpq" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-[#1e628c] hover:underline"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a 
                                href="https://docs.google.com/document/d/18YQf-p_lAWLWkv4xXltvtJMY8fW0MRn5ur2BUNjhdHE/edit?tab=t.0" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-[#1e628c] hover:underline"
                            >
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                    {validationErrors.terms && (
                        <p className="text-xs text-red-600">{validationErrors.terms}</p>
                    )}
                    
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="w-full rounded-lg bg-[#1e628c] py-2.5 text-center font-medium text-white hover:bg-[#17516f] focus:outline-none focus:ring-2 focus:ring-[#1e628c] focus:ring-offset-2 disabled:bg-[#1e628c]/70"
                    >
                        {isSubmitting || isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Creating account...
                            </span>
                        ) : "Create account"}
                    </button>
                    
                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-[#1e628c] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
                
                {/* Password requirements info */}
                <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                    <div className="flex items-center gap-2 font-medium mb-2">
                        <Info className="h-4 w-4 flex-shrink-0" />
                        <span>Password requirements:</span>
                    </div>
                    <ul className="ml-6 list-disc space-y-1">
                        <li>At least 6 characters</li>
                        <li>Longer passwords are stronger</li>
                        <li>Required to use letters, numbers, and symbols</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;