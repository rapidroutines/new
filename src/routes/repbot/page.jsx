import { useState, useEffect, useRef } from "react";
import { Loader2, Info, Check } from "lucide-react";
import { useExercises } from "@/contexts/exercise-context";
import { Footer } from "@/layouts/footer";

const RepBotPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const { addExercise, getExercises } = useExercises();
    const iframeRef = useRef(null);
    
    // Keep track of processed exercise messages to prevent duplicates
    const processedMessages = useRef(new Set());
    
    // Track recent exercise sessions to consolidate repetitions
    const recentExerciseSessions = useRef({});
    
    // Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (event) => {
            // Only accept messages from our iframe source domains
            if (
                event.origin !== "https://render-repbot.vercel.app" && 
                event.origin !== "https://render-repbot.onrender.com"
            ) {
                return;
            }
            
            // Check if it's an exercise completion message
            if (event.data && event.data.type === "exerciseCompleted") {
                const { exerciseType, repCount } = event.data;
                
                // Create a unique message ID based on the timestamp and rep details
                const messageId = `${exerciseType}-${repCount}-${Date.now()}`;
                
                // Skip if we've already processed this message
                if (processedMessages.current.has(messageId)) {
                    console.log("Duplicate message detected, skipping:", messageId);
                    return;
                }
                
                // Add to processed set
                processedMessages.current.add(messageId);
                
                // Manage exercise sessions
                const currentTime = Date.now();
                const sessionKey = exerciseType;
                
                // Check if we have an existing session for this exercise type
                const existingSession = recentExerciseSessions.current[sessionKey];
                
                // If no existing session or session is too old (e.g., more than 5 minutes old)
                if (!existingSession || (currentTime - existingSession.timestamp > 5 * 60 * 1000)) {
                    // Create a new session
                    recentExerciseSessions.current[sessionKey] = {
                        exerciseType,
                        totalReps: repCount,
                        timestamp: currentTime
                    };
                } else {
                    // Update existing session
                    existingSession.totalReps += repCount;
                    existingSession.timestamp = currentTime;
                }
                
                // Log the exercise to the user's history
                const sessionToLog = recentExerciseSessions.current[sessionKey];
                const success = addExercise({
                    exerciseType: sessionToLog.exerciseType,
                    count: sessionToLog.totalReps,
                    timestamp: new Date(sessionToLog.timestamp).toISOString()
                });
                
                if (success) {
                    showNotification("success", `${sessionToLog.totalReps} rep${sessionToLog.totalReps !== 1 ? "s" : ""} of ${formatExerciseType(exerciseType)} saved to your log!`);
                }
            }
        };
        
        // Add the event listener
        window.addEventListener("message", handleMessage);
        
        // Clean up
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [addExercise]);
    
    // For backwards compatibility, check localStorage as a fallback (with duplicate prevention)
    useEffect(() => {
        // Keep track of processed localStorage items
        const processedStorageItems = new Set();
        
        const checkLocalStorageForExercises = () => {
            try {
                const repbotExerciseKey = "repbot_lastExercise";
                const storedExercise = localStorage.getItem(repbotExerciseKey);
                
                if (storedExercise) {
                    // Parse the stored exercise data
                    const exerciseData = JSON.parse(storedExercise);
                    
                    // Create a unique ID for this storage entry
                    const storageId = `${exerciseData.type}-${exerciseData.count}-${exerciseData.timestamp}`;
                    
                    // Skip if we've already processed this exercise
                    if (processedStorageItems.has(storageId)) {
                        return;
                    }
                    
                    // Check if this is a new exercise (hasn't been processed yet)
                    if (!exerciseData.processed) {
                        // Log the exercise
                        const success = addExercise({
                            exerciseType: exerciseData.type,
                            count: exerciseData.count
                        });
                        
                        if (success) {
                            showNotification("success", `${exerciseData.count} rep${exerciseData.count !== 1 ? "s" : ""} of ${formatExerciseType(exerciseData.type)} saved to your log!`);
                            
                            // Mark as processed and save back to localStorage
                            localStorage.setItem(repbotExerciseKey, JSON.stringify({
                                ...exerciseData,
                                processed: true
                            }));
                            
                            // Add to processed set
                            processedStorageItems.add(storageId);
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking localStorage for exercises:", error);
            }
        };
        
        // Check for exercises periodically
        const interval = setInterval(checkLocalStorageForExercises, 2000);
        
        // Also check when the component mounts
        checkLocalStorageForExercises();
        
        return () => clearInterval(interval);
    }, [addExercise]);
    
    // Format exercise type name nicely
    const formatExerciseType = (exerciseType) => {
        const names = {
            bicepCurl: "Bicep Curl",
            squat: "Squat",
            pushup: "Push-up",
            shoulderPress: "Shoulder Press",
            tricepExtension: "Tricep Extension",
            lunge: "Lunge",
            russianTwist: "Russian Twist"
        };
        
        return names[exerciseType] || exerciseType;
    };
    
    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Notification */}
            {notification && (
                <div 
                    className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-3 pr-4 shadow-md transition-all max-w-md ${
                        notification.type === "success" ? "bg-green-100 text-green-800" : 
                        notification.type === "error" ? "bg-red-100 text-red-800" : 
                        "bg-blue-100 text-blue-800"
                    }`}
                >
                    {notification.type === "success" ? (
                        <Check className="h-5 w-5 flex-shrink-0" />
                    ) : (
                        <Info className="h-5 w-5 flex-shrink-0" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}
            
            <div className="relative flex-1 w-full overflow-hidden bg-white dark:bg-slate-950 rounded-lg shadow-sm" style={{ minHeight: "600px" }}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 z-10">
                        <div className="flex flex-col items-center text-center">
                            <Loader2 className="h-10 w-10 animate-spin text-[#1e628c]" />
                            <p className="mt-2 text-slate-600 dark:text-slate-300">Loading RepBot...</p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The AI model may take 1-2 minutes to initialize</p>
                        </div>
                    </div>
                )}
                
                <iframe 
                    ref={iframeRef}
                    src="https://render-repbot.vercel.app/" 
                    className="w-full h-full border-0"
                    title="RepBot AI Exercise Counter"
                    onLoad={() => setIsLoading(false)}
                    allow="camera; microphone; accelerometer; gyroscope; fullscreen"
                    allowFullScreen
                    style={{ borderRadius: '0.5rem' }}
                />
            </div>
            
            {/* Updated bottom message with smaller margin to save space */}
            <div className="text-center text-sm text-slate-600 mt-3 mb-2">
                <p>Please allow 1-2 minutes for RepBot to become active. Your exercises will be saved automatically.</p>
            </div>
            
            {/* Added Footer Component */}
            <Footer />
        </div>
    );
};

export default RepBotPage;
