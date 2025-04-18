import { useState } from "react";
import { Footer } from "@/layouts/footer";

const ExerciseTrackerPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    return (
        <div className="flex flex-col min-h-screen">
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
