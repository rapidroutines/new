import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { AlertCircle, CheckCircle, ArrowLeft, Mail, Info } from "lucide-react";
import logoLight from "@/assets/main_logo.png";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { forgotPassword, isLoading, error, setError } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        
        try {
            const success = await forgotPassword(email);
            
            setIsSubmitted(true);
            setIsSuccess(true);
        } catch (err) {
            setError(err?.message || "Failed to send password reset email. Please try again.");
            setIsSubmitted(false);
            setIsSuccess(false);
        }
    };
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex flex-col items-center">
                    <img src={logoLight} alt="RapidRoutines" className="h-12 mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
                    <p className="text-slate-500">
                        {isSubmitted
                            ? "Check your email for reset instructions"
                            : "Enter your email to receive a password reset link"}
                    </p>
                    {!isSubmitted && (
                        <div className="mt-2 text-center">
                            <div className="text-xs text-amber-600 flex items-center justify-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 mt-2">
                                <Info className="h-4 w-4" />
                                <span>Please allow 3-5 minutes for the password reset email to arrive</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                
                {isSubmitted && isSuccess ? (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-3 rounded-lg bg-green-50 p-6 text-green-800 border border-green-200">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Mail className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-medium text-green-800">Check your inbox</h3>
                            <p className="text-center text-green-700">
                                We've sent a password reset link to <strong>{email}</strong>. 
                                Please check your email and follow the instructions to reset your password.
                            </p>
                            <p className="text-sm text-green-600">
                                The link will expire in 1 hour for security reasons.
                            </p>
                        </div>
                        
                        <div className="mt-6 text-center space-y-4">
                            <p className="text-sm text-slate-600">Didn't receive the email? Check your spam folder or try again.</p>
                            <button 
                                onClick={() => setIsSubmitted(false)}
                                className="text-[#1e628c] hover:underline font-medium"
                            >
                                Try a different email
                            </button>
                            <div className="pt-2">
                                <Link to="/login" className="flex items-center justify-center gap-2 text-[#1e628c] hover:underline">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-[#1e628c] py-2.5 text-center font-medium text-white hover:bg-[#17516f] focus:outline-none focus:ring-2 focus:ring-[#1e628c] focus:ring-offset-2 disabled:bg-[#1e628c]/70"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : "Send reset link"}
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

export default ForgotPasswordPage;
