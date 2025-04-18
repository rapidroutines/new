// src/routes/repbot/page.jsx
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useExercises } from "@/contexts/exercise-context";
import { Footer } from "@/layouts/footer";

const RepBotPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { addExercise } = useExercises();
    const iframeRef = useRef(null);
    
    // Keep track of processed message IDs to avoid duplicates
    const processedMessages = useRef(new Set());
    
    useEffect(() => {
        const handleMessage = (event) => {
            // Validate message origin
            if (
                event.origin !== "https://render-repbot.vercel.app" && 
                event.origin !== "https://render-repbot.onrender.com"
            ) {
                return;
            }
            
            if (event.data && event.data.type === "exerciseCompleted") {
                const { exerciseType, repCount } = event.data;
                
                // Generate a unique ID for this message
                const messageId = `${exerciseType}-${repCount}-${Date.now()}`;
                
                // Skip if we've already processed this message
                if (processedMessages.current.has(messageId)) {
                    console.log("Duplicate message detected, skipping:", messageId);
                    return;
                }
                
                // Mark this message as processed
                processedMessages.current.add(messageId);
                
                // Log the exercise directly to the user's account
                addExercise({
                    exerciseType: exerciseType,
                    count: repCount,
                    timestamp: new Date().toISOString()
                });
                
                console.log(`Exercise logged: ${exerciseType}, ${repCount} reps`);
            }
        };
        
        // Add event listener
        window.addEventListener("message", handleMessage);
        
        // Clean up function
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [addExercise]);

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <div className="relative flex-1 w-full bg-white dark:bg-slate-950 rounded-lg shadow-sm" style={{ minHeight: "600px", overflow: "hidden" }}>
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
            
            <div className="text-center text-sm text-slate-600 mt-3 mb-2">
                <p>Your exercises are automatically saved as you complete them if you are signed in.</p>
            </div>
            
            <Footer />
        </div>
    );
};

export default RepBotPage;