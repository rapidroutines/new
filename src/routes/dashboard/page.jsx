import { useMediaQuery } from "@uidotdev/usehooks";
import { ExerciseLog } from "@/components/exercise-log";
import { SavedExercises } from "@/components/saved-exercises";
import { RecentChatbotChats } from "@/components/recent-chatbot-chats";
import { AuthOverlay } from "@/components/auth-overlay";
import { useAuth } from "@/contexts/auth-context";
import { Footer } from "@/layouts/footer";

const DashboardPage = () => {
  const brandColor = "#1e628c";
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1023px)");
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Auth overlay only for the dashboard when not authenticated */}
      {!isAuthenticated && <AuthOverlay title="Dashboard" />}
      
      <div className="flex-grow flex flex-col gap-4 sm:gap-6 p-4">
        {/* Welcome Banner - Responsive text sizes */}
        <div className="rounded-xl py-6 px-4 sm:py-8 sm:px-6 text-white" style={{ backgroundColor: brandColor }}>
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome to RapidRoutines AI</h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/90">
            The all-in-one place for tracking your workouts with our RepBot, saving your favorite exercises from the library, and viewing your ChatBot history.
          </p>
        </div>

        {/* Grid layout for main content - Responsive grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <div className="rounded-xl border-2 border-slate-400 bg-white shadow-sm">
            <ExerciseLog maxItems={isMobile ? 3 : (isTablet ? 4 : 6)} />
          </div>
          
          <div className="rounded-xl border-2 border-slate-400 bg-white shadow-sm">
            <SavedExercises maxItems={isMobile ? 2 : (isTablet ? 4 : 6)} />
          </div>
        </div>
        
        {/* Recent Chatbot Chats Section */}
        <div className="rounded-xl border-2 border-slate-400 bg-white shadow-sm">
          <RecentChatbotChats maxItems={isMobile ? 1 : 2} />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
