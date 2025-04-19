import { useState } from "react";
import { useSavedExercises } from "@/contexts/saved-exercises-context";
import { Link } from "react-router-dom";
import { BookmarkCheck, ChevronRight, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export const SavedExercises = ({ maxItems = 4 }) => {
    const { savedExercises, removeSavedExercise, removeAllSavedExercises, isLoading } = useSavedExercises();
    const [expandedView, setExpandedView] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [notification, setNotification] = useState(null);

    const exercisesToDisplay = expandedView
        ? savedExercises
        : savedExercises.slice(0, maxItems);

    const getCategoryColor = (category) => {
        const colors = {
            calisthenics: "bg-blue-100 text-blue-600",
            core: "bg-green-100 text-green-600",
            mobility: "bg-yellow-100 text-yellow-600",
        };
        return colors[category] || "bg-slate-100 text-slate-600";
    };

    const handleRemove = (e, exercise) => {
        e.stopPropagation();
        removeSavedExercise(exercise.id);
    };

    const handleRemoveAll = () => {
        if (confirm("Are you sure you want to remove all saved exercises?")) {
            removeAllSavedExercises();
            showNotification("success", "All exercises have been removed");
        }
    };

    const showExerciseDetails = (exercise) => {
        setSelectedExercise(exercise);
    };

    const closeExerciseDetails = () => {
        setSelectedExercise(null);
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg bg-white p-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e628c]"></div>
            </div>
        );
    }

    if (!savedExercises || savedExercises.length === 0) {
        return (
            <div className="rounded-xl bg-white p-6">
                <h2 className="mb-4 text-xl font-bold">Saved Exercises</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <p className="text-slate-600">You haven't saved any exercises yet.</p>
                    <Link to="/library" className="mt-3 text-sm font-medium text-[#1e628c] hover:underline">
                        Explore exercise library
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white p-6">
            {notification && (
                <div 
                    className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-3 pr-4 shadow-md transition-all ${
                        notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                    {notification.type === "success" ? (
                        <div className="flex items-center">
                            <div className="mr-2 rounded-full bg-green-200 p-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            {notification.message}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            {notification.message}
                        </div>
                    )}
                </div>
            )}
            
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Saved Exercises</h2>
                <div className="flex items-center gap-3">
                    {savedExercises.length > 0 && (
                        <button
                            onClick={handleRemoveAll}
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[#1e628c] hover:bg-[#1e628c]/10"
                            title="Remove all saved exercises"
                        >
                            <BookmarkCheck className="h-4 w-4" />
                            <span className="hidden sm:inline">Unsave All</span>
                        </button>
                    )}
                    {savedExercises.length > maxItems && (
                        <button
                            onClick={() => setExpandedView(!expandedView)}
                            className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                        >
                            {expandedView ? "Show Less" : "View All"}
                            <ChevronRight className="h-4 w-4" strokeWidth={2} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {exercisesToDisplay.map((exercise) => (
                    <div
                        key={exercise.id}
                        onClick={() => showExerciseDetails(exercise)}
                        className="group relative flex cursor-pointer overflow-hidden rounded-lg border border-slate-100"
                    >
                        <div className="relative h-[80px] min-w-[80px] overflow-hidden">
                            <img
                                src={exercise.image}
                                alt={exercise.title}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-3">
                            <div>
                                <div className="flex justify-between">
                                    <h3 className="text-sm font-medium text-slate-800">{exercise.title}</h3>
                                    <button
                                        onClick={(e) => handleRemove(e, exercise)}
                                        className="opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100"
                                        aria-label="Remove from saved"
                                    >
                                        <BookmarkCheck className="h-4 w-4 text-[#1e628c]" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <span
                                    className={cn(
                                        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                                        getCategoryColor(exercise.category)
                                    )}
                                >
                                    {exercise.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <span
                                            key={level}
                                            className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                level <= exercise.difficulty ? "bg-[#1e628c]" : "bg-slate-300"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!expandedView && savedExercises.length > maxItems && (
                <button
                    onClick={() => setExpandedView(true)}
                    className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Show All ({savedExercises.length}) Saved Exercises
                </button>
            )}

            {savedExercises.length > 0 && (
                <div className="mt-4 text-center">
                    <Link
                        to="/library"
                        className="text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        Explore more exercises
                    </Link>
                </div>
            )}

            {selectedExercise && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeExerciseDetails}>
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-0" onClick={(e) => e.stopPropagation()}>
                        <div className="relative h-56 w-full">
                            <img 
                                src={selectedExercise.image} 
                                alt={selectedExercise.title} 
                                className="h-full w-full object-cover"
                            />
                            
                            <div 
                                className="absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-white"
                                style={{
                                    backgroundColor: 
                                        selectedExercise.category === 'calisthenics' ? "#1e628c" : 
                                        selectedExercise.category === 'mobility' ? "#10b981" : "#f97316"
                                }}
                            >
                                {selectedExercise.category}
                            </div>
                            
                            <button 
                                className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-slate-800 hover:bg-white"
                                onClick={closeExerciseDetails}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            
                            <button
                                onClick={(e) => handleRemove(e, selectedExercise)}
                                className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium shadow-md transition-colors hover:bg-slate-50"
                            >
                                <BookmarkCheck className="h-4 w-4 text-[#1e628c]" />
                                <span>Saved</span>
                            </button>
                            
                            <div className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-md">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <span 
                                            key={level}
                                            className={cn(
                                                "h-2 w-2 rounded-full",
                                                level <= selectedExercise.difficulty 
                                                    ? "bg-slate-500" 
                                                    : "bg-slate-200"
                                            )}
                                            style={{
                                                backgroundColor: level <= selectedExercise.difficulty 
                                                    ? "#1e628c" 
                                                    : "#e2e8f0"
                                            }}
                                        />
                                    ))}
                                </div>
                                <span>
                                    {selectedExercise.difficulty === 1 ? 'Beginner' : 
                                     selectedExercise.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-slate-900">{selectedExercise.title}</h2>
                            <p className="mt-2 text-slate-600">{selectedExercise.description}</p>
                            
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <h3 className="text-sm font-semibold text-slate-900">Sets</h3>
                                    <p className="mt-1 text-lg font-medium text-[#1e628c]">{selectedExercise.sets}</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <h3 className="text-sm font-semibold text-slate-900">Reps/Duration</h3>
                                    <p className="mt-1 text-lg font-medium text-[#1e628c]">{selectedExercise.reps}</p>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e628c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                    Tips
                                </h3>
                                <ul className="mt-3 space-y-2">
                                    {selectedExercise.tips.map((tip, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1e628c]"></div>
                                            <span className="text-slate-700">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="mt-8 border-t border-slate-200 pt-4">
                                <button
                                    className="w-full rounded-lg bg-[#1e628c] py-3 font-medium text-white transition-colors hover:bg-[#174e70]"
                                    onClick={closeExerciseDetails}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
