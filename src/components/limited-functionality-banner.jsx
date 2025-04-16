import { Info, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const LimitedFunctionalityBanner = ({ featureName = "feature" }) => {
  return (
    <div className="mb-4 rounded-lg bg-amber-50 p-4 border border-amber-200">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Info className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-amber-800">Limited functionality mode</h3>
          <p className="mt-1 text-sm text-amber-700">
            You're using this {featureName} in guest mode. Your data and progress won't be saved.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-200"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1 rounded-md bg-[#1e628c] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#17516f]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

LimitedFunctionalityBanner.propTypes = {
  featureName: PropTypes.string
};