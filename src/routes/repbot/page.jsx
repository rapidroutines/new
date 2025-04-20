import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useExercises } from "@/contexts/exercise-context";
import { Footer } from "@/layouts/footer";

const RepBotPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { addExercise } = useExercises();
    const iframeRef = useRef(null);
    
    const processedExercises = useRef(new Map());
    
    useEffect(() => {
        const handleMessage = (event) => {
            if (
                event.origin !== "https://render-repbot.vercel.app" && 
                event.origin !== "https://render-repbot.onrender.com"
            ) {
                return;
            }
            
            if (event.data && event.data.type === "exerciseCompleted") {
                const { exerciseType, repCount, timestamp } = event.data;
                const exerciseTimestamp = timestamp || new Date().toISOString();
                
                const exerciseKey = `${exerciseType}-${repCount}-${exerciseTimestamp}`;
                
                if (!processedExercises.current.has(exerciseKey)) {
                    addExercise({
                        exerciseType: exerciseType,
                        count: repCount,
                        timestamp: exerciseTimestamp
                    });
                    
                    processedExercises.current.set(exerciseKey, true);
                    
                    console.log(`Exercise logged: ${exerciseType}, ${repCount} reps at ${exerciseTimestamp}`);
                    
                    if (processedExercises.current.size > 50) {
                        const entries = Array.from(processedExercises.current.entries());
                        entries.slice(0, entries.length - 50).forEach(([key]) => {
                            processedExercises.current.delete(key);
                        });
                    }
                }
            }
        };
        
        window.addEventListener("message", handleMessage);
        
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [addExercise]);
    
    useEffect(() => {
        const checkLocalStorageForExercises = () => {
            try {
                const repbotExerciseKey = "repbot_lastExercise";
                const storedExercise = localStorage.getItem(repbotExerciseKey);
                
                if (storedExercise) {
                    const exerciseData = JSON.parse(storedExercise);
                    const exerciseTimestamp = exerciseData.timestamp || new Date().toISOString();
                    const exerciseKey = `${exerciseData.type}-${exerciseData.count}-${exerciseTimestamp}`;
                    
                    if (!processedExercises.current.has(exerciseKey) && !exerciseData.processed) {
                        addExercise({
                            exerciseType: exerciseData.type,
                            count: exerciseData.count,
                            timestamp: exerciseTimestamp
                        });
                        
                        localStorage.setItem(repbotExerciseKey, JSON.stringify({
                            ...exerciseData,
                            processed: true
                        }));
                        
                        processedExercises.current.set(exerciseKey, true);
                        console.log(`Exercise from localStorage logged: ${exerciseData.type}, ${exerciseData.count} reps at ${exerciseTimestamp}`);
                    }
                }
            } catch (error) {
                console.error("Error checking localStorage for exercises:", error);
            }
        };
        
        checkLocalStorageForExercises();
        
        const interval = setInterval(checkLocalStorageForExercises, 2000);
        
        return () => clearInterval(interval);
    }, [addExercise]);

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
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
                    onLoad={() => {
                        setIsLoading(false);
                        processedExercises.current.clear();
                    }}
                    allow="camera; microphone; accelerometer; gyroscope; fullscreen"
                    allowFullScreen
                    style={{ borderRadius: '0.5rem' }}
                />
            </div>
            
            <div className="text-center text-sm text-slate-600 mt-3 mb-2">
                <p>Your reps are automatically saved if you are signed in. Do not leave the RepBot page instantly or else reps will not save completely. </p>
            </div>
            
            <Footer />
        </div>
    );
};

export default RepBotPage;
