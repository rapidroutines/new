// src/components/auth-overlay.jsx
import { Link } from "react-router-dom";
import { Lock, UserPlus, LogIn } from "lucide-react";
import PropTypes from "prop-types"; // Make sure PropTypes is imported

export const AuthOverlay = ({ title = "Dashboard" }) => {
  return (
    <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-100/70 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-[#1e628c]/10 rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-[#1e628c]" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to access the {title}</h2>
        <p className="text-slate-600 mb-6">
          Create an account or sign in to view your dashboard and save your fitness data
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 bg-[#1e628c] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#17516f] transition-colors"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Link>
          
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 border border-slate-300 bg-white text-slate-800 py-2.5 px-4 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Create Account
          </Link>
        </div>
        
        <p className="mt-6 text-sm text-slate-500">
          By signing up, you'll be able to save your progress and access personalized features.
        </p>
      </div>
    </div>
  );
};

AuthOverlay.propTypes = {
  title: PropTypes.string
};
