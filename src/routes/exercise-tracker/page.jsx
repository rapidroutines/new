import { useState, useEffect, useRef } from "react";
import { Footer } from "@/layouts/footer";
import { useExercises } from "@/contexts/exercise-context";
import { useAuth } from "@/contexts/auth-context";
import { LimitedFunctionalityBanner } from "@/components/limited-functionality-banner";

const ExerciseTrackerPage = ({ limited = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef(null);
    const { isAuthenticated } = useAuth();
    const { syncExercisesWithIframe } = useExercises();
    
    useEffect(() => {
        // Handle iframe loading
        const handleIframeLoad = () => {
            setIsLoading(false);
            
            // Sync user data with iframe when it's loaded
            if (iframeRef.current) {
                syncExercisesWithIframe(iframeRef);
            }
        };
        
        // Add event listener for iframe load
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.addEventListener('load', handleIframeLoad);
        }
        
        return () => {
            // Clean up event listener
            if (iframe) {
                iframe.removeEventListener('load', handleIframeLoad);
            }
        };
    }, [iframeRef, syncExercisesWithIframe]);
    
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow flex flex-col gap-y-4 p-0 md:p-2">
                {limited && !isAuthenticated && (
                    <LimitedFunctionalityBanner featureName="Exercise Tracker" />
                )}
                
                <div className="relative rounded-lg shadow-sm overflow-hidden flex-grow h-[calc(100vh-120px)]">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <div className="h-12 w-12 rounded-full border-4 border-[#1e628c]/30 border-t-[#1e628c] animate-spin"></div>
                        </div>
                    )}
                    
                    <div className="w-full h-full">
                        <iframe 
                            ref={iframeRef}
                            src="https://exercise-tracker-tau.vercel.app" 
                            className="w-full h-full border-0"
                            title="Exercise Tracker"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ height: "100%", width: "100%" }}
                        ></iframe>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ExerciseTrackerPage;