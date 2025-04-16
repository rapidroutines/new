import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import logoLight from "@/assets/main_logo.png";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { signup, isLoading, error, setError } = useAuth();
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        // Place the new validation HERE, before the signup call
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+-=[]{};:\"|,.<>/?)");
            return;
        }
    
        const success = await signup(name, email, password);
    
        if (success) {
            navigate("/");
        }
    };
    
    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, text: "" };
        
        if (password.length < 6) return { strength: 1, text: "Weak" };
        if (password.length < 10) return { strength: 2, text: "Medium" };
        return { strength: 3, text: "Strong" };
    };
    
    const passwordStrength = getPasswordStrength();
    
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
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                            placeholder="Your name"
                        />
                    </div>
                    
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                            placeholder="your@email.com"
                        />
                    </div>
                    
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Password
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
                    
                    <div className="flex items-center">
                        <input
                            id="terms"
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-[#1e628c]"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                            I agree to the{" "}
                            <a 
                                href="https://docs.google.com/document/d/18YQf-p_lAWLWkv4xXltvtJMY8fW0MRn5ur2BUNjhdHE/edit?tab=t.lx86jybafkpq" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="font-medium text-[#1e628c] hover:underline"
                            >
                                Terms & Conditions
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
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-[#1e628c] py-2.5 text-center font-medium text-white hover:bg-[#17516f] focus:outline-none focus:ring-2 focus:ring-[#1e628c] focus:ring-offset-2 disabled:bg-[#1e628c]/70"
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>
                    
                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-[#1e628c] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
