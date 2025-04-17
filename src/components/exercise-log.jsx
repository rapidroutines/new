import { useExercises } from "@/contexts/exercise-context";
import { DumbbellIcon, Calendar, RefreshCw, Trash2, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const ExerciseLog = ({ maxItems = 5 }) => {
    const { getExercises, deleteExercise, deleteAllExercises, isLoading } = useExercises();
    const [expandedView, setExpandedView] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [groupedExercises, setGroupedExercises] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [notification, setNotification] = useState(null);
    
    // Get exercises and update when new ones are added
    useEffect(() => {
        const allExercises = getExercises();
        setExercises(allExercises);
        
        // Group exercises by type and date (same day)
        const grouped = groupExercisesByTypeAndDate(allExercises);
        
        // Limit the number of groups if not in expanded view
        const limitedGroups = expandedView ? grouped : grouped.slice(0, maxItems);
        setGroupedExercises(limitedGroups);
        
        // Set up an interval to refresh the exercise list
        const refreshInterval = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 5000); // Check every 5 seconds
        
        return () => clearInterval(refreshInterval);
    }, [getExercises, expandedView, maxItems, refreshKey]);
    
    // Group exercises by type and date (same day)
    const groupExercisesByTypeAndDate = (exerciseList) => {
        if (!exerciseList || exerciseList.length === 0) return [];
        
        // Create a map to store grouped exercises
        const groups = new Map();
        
        // Go through each exercise
        exerciseList.forEach(exercise => {
            const date = new Date(exercise.timestamp);
            const dateKey = date.toDateString(); // Group by day
            const typeKey = exercise.exerciseType;
            const groupKey = `${dateKey}_${typeKey}`;
            
            if (!groups.has(groupKey)) {
                groups.set(groupKey, {
                    id: groupKey,
                    exerciseType: typeKey,
                    count: 1,
                    totalReps: exercise.count,
                    timestamp: exercise.timestamp,
                    exercises: []
                });
            } else {
                const group = groups.get(groupKey);
                group.totalReps += exercise.count;
                
                // Always use the most recent timestamp
                if (new Date(exercise.timestamp) > new Date(group.timestamp)) {
                    group.timestamp = exercise.timestamp;
                }
            }
            
            const group = groups.get(groupKey);
            group.exercises.push(exercise);
        });
        
        // Convert map to array and sort by timestamp (newest first)
        return Array.from(groups.values()).sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    };
    
    // Format date nicely
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };
    
    // Get color based on exercise type
    const getExerciseColor = (exerciseType) => {
        const colors = {
            bicepCurl: "bg-blue-100 text-blue-600",
            squat: "bg-green-100 text-green-600",
            pushup: "bg-red-100 text-red-600",
            shoulderPress: "bg-purple-100 text-purple-600",
            tricepExtension: "bg-yellow-100 text-yellow-600",
            lunge: "bg-orange-100 text-orange-600",
            russianTwist: "bg-indigo-100 text-indigo-600",
            default: "bg-slate-100 text-slate-600"
        };
        
        return colors[exerciseType] || colors.default;
    };
    
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
    
    // Handle deleting a group of exercises
    const handleDeleteExerciseGroup = (e, exerciseGroup) => {
        e.stopPropagation();
        
        if (confirm(`Are you sure you want to delete the ${formatExerciseType(exerciseGroup.exerciseType)} session with ${exerciseGroup.totalReps} reps from ${new Date(exerciseGroup.timestamp).toLocaleDateString()}?`)) {
            // Delete each exercise in the group
            let deleteSuccess = true;
            exerciseGroup.exercises.forEach(exercise => {
                if (!deleteExercise(exercise.id)) {
                    deleteSuccess = false;
                }
            });
            
            if (deleteSuccess) {
                showNotification("success", `Deleted ${formatExerciseType(exerciseGroup.exerciseType)} session with ${exerciseGroup.totalReps} reps`);
                
                // Refresh the list
                setRefreshKey(prev => prev + 1);
            }
        }
    };
    
    // Handle deleting all exercises
    const handleDeleteAllExercises = () => {
        if (confirm("Are you sure you want to delete ALL exercise records? This cannot be undone.")) {
            const success = deleteAllExercises();
            
            if (success) {
                showNotification("success", "All exercise records deleted successfully");
            }
        }
    };
    
    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };
    
    // Manual refresh function
    const handleRefresh = () => {
        const allExercises = getExercises();
        setExercises(allExercises);
        
        // Group exercises by type and date
        const grouped = groupExercisesByTypeAndDate(allExercises);
        
        // Limit the number of groups if not in expanded view
        const limitedGroups = expandedView ? grouped : grouped.slice(0, maxItems);
        setGroupedExercises(limitedGroups);
    };
    
    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg bg-white p-6 shadow-md">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e628c]"></div>
            </div>
        );
    }
    
    if (!exercises || exercises.length === 0) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Exercise Log</h2>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        <RefreshCw className="h-4 w-4" strokeWidth={2} />
                        Refresh
                    </button>
                </div>
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <DumbbellIcon className="mb-2 h-8 w-8 text-slate-400" />
                    <p className="text-slate-600">No exercise records found.</p>
                    <p className="text-sm text-slate-500">Complete exercises with RepBot to see your activity here.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            {/* Notification */}
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
                <h2 className="text-xl font-bold">Exercise Log</h2>
                <div className="flex items-center gap-3">
                    {exercises.length > 0 && (
                        <button
                            onClick={handleDeleteAllExercises}
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                            title="Delete all exercise records"
                        >
                            <XCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete All</span>
                        </button>
                    )}
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                        title="Refresh exercise list"
                    >
                        <RefreshCw className="h-4 w-4" strokeWidth={2} />
                    </button>
                    {groupedExercises.length > maxItems && (
                        <button
                            onClick={() => setExpandedView(!expandedView)}
                            className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                        >
                            {expandedView ? "Show Less" : "View All"}
                        </button>
                    )}
                </div>
            </div>
            
            <div className="space-y-4">
                {groupedExercises.map((group) => (
                    <div key={group.id} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0">
                        {/* Removed the icon and left padding here to give more space to the exercise name/data */}
                        <div className="flex-1 pl-2">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p className="font-medium">
                                    x{group.totalReps} {formatExerciseType(group.exerciseType)}
                                    <span className="ml-1 text-xs text-slate-500">(1 session)</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => handleDeleteExerciseGroup(e, group)}
                                        className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                        title="Delete this exercise record"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(group.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {exercises.length > 0 && !expandedView && groupedExercises.length < (exercises.length / 2) && (
                <button
                    onClick={() => setExpandedView(true)}
                    className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Show All ({Math.ceil(exercises.length / 2)}) Exercise Sessions
                </button>
            )}
        </div>
    );
};