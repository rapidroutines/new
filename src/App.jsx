import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";
import RapidTreePage from "@/routes/rapidtree/page";
import ProfilePage from "@/routes/profile/page";
import LoginPage from "@/routes/auth/login";
import SignupPage from "@/routes/auth/signup";
import ForgotPasswordPage from "@/routes/auth/forgot-password";
import ResetPasswordPage from "@/routes/auth/reset-password";
import { ProtectedRoute } from "@/components/protected-route";
import { PublicRoute } from "@/components/public-route";
import { useAuth } from "@/contexts/auth-context";

function App() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-100">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1e628c] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

                {/* Dashboard with auth overlay if not authenticated */}
                <Route path="/" element={
                    <Layout>
                        <DashboardPage />
                    </Layout>
                } />

                {/* Feature routes - accessible to all but with limited functionality when not authenticated */}
                <Route path="/chatbot" element={
                    <Layout>
                        <ChatbotPage limited={!isAuthenticated} />
                    </Layout>
                } />

                <Route path="/exercise-tracker" element={
                    <Layout>
                        <ExerciseTrackerPage limited={!isAuthenticated} />
                    </Layout>
                } />

                <Route path="/library" element={
                    <Layout>
                        <LibraryPage limited={!isAuthenticated} />
                    </Layout>
                } />

                <Route path="/rapidtree" element={
                    <Layout>
                        <RapidTreePage limited={!isAuthenticated} />
                    </Layout>
                } />

                <Route path="/repbot" element={
                    <Layout>
                        <RepBotPage limited={!isAuthenticated} />
                    </Layout>
                } />

                {/* Protected Routes - redirect to login if not authenticated */}
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Layout><ProfilePage /></Layout>
                    </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;