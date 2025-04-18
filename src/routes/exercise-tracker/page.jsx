import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { useAuth } from "@/contexts/auth-context";
import axios from "axios";
import { AuthOverlay } from "@/components/auth-overlay";

const ExerciseTrackerPage = ({ limited = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();
    const [trackerExercises, setTrackerExercises] = useState([]);
    
    useEffect(() => {
        if (isAuthenticated) {
            fetchExercisesFromServer();
        }
    }, [isAuthenticated]);
    
    const fetchExercisesFromServer = async () => {
        try {
            const response = await axios.get("/api/user-data/get-data");
            const userData = response.data;
            
            if (userData.trackerExercises) {
                setTrackerExercises(userData.trackerExercises);
            }
        } catch (error) {
            console.error("Error fetching tracker exercises:", error);
        }
    };
    
    const saveExerciseToServer = async (exercise) => {
        try {
            // Add the new exercise to the existing list
            const updatedExercises = [...trackerExercises, exercise];
            setTrackerExercises(updatedExercises);
            
            // Save to server
            await axios.post("/api/user-data/save-data", {
                dataType: "trackerExercises",
                data: updatedExercises
            });
            
            return true;
        } catch (error) {
            console.error("Error saving exercise:", error);
            return false;
        }
    };
    
    const removeExerciseFromServer = async (exerciseId) => {
        try {
            const updatedExercises = trackerExercises.filter(ex => ex.id !== exerciseId);
            setTrackerExercises(updatedExercises);
            
            await axios.post("/api/user-data/save-data", {
                dataType: "trackerExercises",
                data: updatedExercises
            });
            
            return true;
        } catch (error) {
            console.error("Error removing exercise:", error);
            return false;
        }
    };
    
    useEffect(() => {
        // Handle messages from the iframe
        const messageHandler = (event) => {
            // Make sure the message is from our iframe
            if (
                event.origin !== "https://exercise-tracker-tau.vercel.app" && 
                event.origin !== window.location.origin
            ) {
                return;
            }
            
            if (event.data && event.data.type) {
                switch (event.data.type) {
                    case "checkAuth":
                        // Send authentication status to iframe
                        const iframe = document.querySelector('iframe');
                        if (iframe && iframe.contentWindow) {
                            iframe.contentWindow.postMessage({
                                type: "authStatus",
                                isAuthenticated: isAuthenticated,
                                userId: user?.id || null
                            }, "*");
                        }
                        break;
                    
                    case "getTrackerExercises":
                        // Send exercises data to iframe
                        const iframeForData = document.querySelector('iframe');
                        if (iframeForData && iframeForData.contentWindow) {
                            iframeForData.contentWindow.postMessage({
                                type: "trackerExercisesData",
                                exercises: trackerExercises
                            }, "*");
                        }
                        break;
                    
                    case "saveTrackerExercise":
                        // Save exercise to server
                        if (isAuthenticated && event.data.exercise) {
                            saveExerciseToServer(event.data.exercise);
                        }
                        break;
                    
                    case "removeTrackerExercise":
                        // Remove exercise from server
                        if (isAuthenticated && event.data.exerciseId) {
                            removeExerciseFromServer(event.data.exerciseId);
                        }
                        break;
                }
            }
        };
        
        window.addEventListener("message", messageHandler);
        
        return () => {
            window.removeEventListener("message", messageHandler);
        };
    }, [isAuthenticated, user, trackerExercises]);
    
    return (
        <div className="flex flex-col min-h-screen">
            {!isAuthenticated && limited && <AuthOverlay title="Exercise Tracker" />}
            
            <div className="flex-grow flex flex-col gap-y-4 p-0 md:p-2">
                <div className="relative rounded-lg shadow-sm overflow-hidden flex-grow h-[calc(100vh-120px)]">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <div className="h-12 w-12 rounded-full border-4 border-[#1e628c]/30 border-t-[#1e628c] animate-spin"></div>
                        </div>
                    )}
                    
                    <div className="w-full h-full">
                        <iframe 
                            src="https://exercise-tracker-tau.vercel.app" 
                            className="w-full h-full border-0"
                            title="Exercise Tracker"
                            onLoad={() => setIsLoading(false)}
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
