import { useExercises } from "@/contexts/exercise-context";
import { DumbbellIcon, Calendar, Trash2, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";

export const ExerciseLog = ({ maxItems = 5, limited = false }) => {
    const { getExercises, deleteExercisesByIds, deleteAllExercises, isLoading } = useExercises();
    const { isAuthenticated } = useAuth();
    const [expandedView, setExpandedView] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [groupedExercises, setGroupedExercises] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [notification, setNotification] = useState(null);
    
    useEffect(() => {
        const loadExercises = () => {
            const allExercises = getExercises();
            setExercises(allExercises);
            
            const grouped = groupExercisesByTypeAndDate(allExercises);
            const limitedGroups = expandedView ? grouped : grouped.slice(0, maxItems);
            setGroupedExercises(limitedGroups);
        };
        
        loadExercises();
        
        const refreshInterval = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 5000); 
        
        return () => clearInterval(refreshInterval);
    }, [getExercises, expandedView, maxItems, refreshKey]);
    
    const groupExercisesByTypeAndDate = (exerciseList) => {
        if (!exerciseList || exerciseList.length === 0) return [];
        
        const groups = new Map();
        
        exerciseList.forEach(exercise => {
            const date = new Date(exercise.timestamp);
            const dateKey = date.toDateString(); 
            const typeKey = exercise.exerciseType;
            const groupKey = `${dateKey}_${typeKey}`;
            
            if (!groups.has(groupKey)) {
                groups.set(groupKey, {
                    id: groupKey,
                    exerciseType: typeKey,
                    count: 1,
                    totalReps: exercise.count,
                    timestamp: exercise.timestamp,
                    exercises: [exercise]
                });
            } else {
                const group = groups.get(groupKey);
                group.count += 1;
                group.totalReps += exercise.count;
                group.exercises.push(exercise);
                
                if (new Date(exercise.timestamp) > new Date(group.timestamp)) {
                    group.timestamp = exercise.timestamp;
                }
            }
        });
        
        return Array.from(groups.values()).sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    };
    
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
    
    const handleDeleteExerciseGroup = async (e, exerciseGroup) => {
        e.stopPropagation();
        
        if (limited && !isAuthenticated) {
            showNotification("warning", "Sign in to delete exercises");
            return;
        }
        
        if (confirm(`Are you sure you want to delete the entire ${formatExerciseType(exerciseGroup.exerciseType)} session with ${exerciseGroup.totalReps} reps from ${new Date(exerciseGroup.timestamp).toLocaleDateString()}?`)) {
            try {
                // First remove the card from UI immediately for better user feedback
                setGroupedExercises(prevGroups => 
                    prevGroups.filter(group => group.id !== exerciseGroup.id)
                );
                
                // Get all exercise IDs in this group
                const exerciseIdsToDelete = exerciseGroup.exercises.map(ex => ex.id);
                
                // Delete all exercises in this group using the new batch delete function
                const success = await deleteExercisesByIds(exerciseIdsToDelete);
                
                if (success) {
                    // Update the local exercises state after deletion
                    setExercises(prevExercises => 
                        prevExercises.filter(ex => !exerciseIdsToDelete.includes(ex.id))
                    );
                    
                    showNotification("success", `Deleted ${formatExerciseType(exerciseGroup.exerciseType)} session with ${exerciseGroup.totalReps} reps`);
                } else {
                    showNotification("error", "Failed to delete exercise session");
                    handleRefresh(); // Refresh to restore correct state
                }
            } catch (error) {
                console.error("Error deleting exercise group:", error);
                showNotification("error", "Failed to delete exercise session");
                handleRefresh(); // Refresh to restore correct state
            }
        }
    };
    
    const handleDeleteAllExercises = async () => {
        if (limited && !isAuthenticated) {
            showNotification("warning", "Sign in to delete exercises");
            return;
        }
        
        if (confirm("Are you sure you want to delete ALL exercise records? This cannot be undone.")) {
            try {
                // Update UI immediately for better feedback
                setGroupedExercises([]);
                
                // Perform the deletion
                const success = await deleteAllExercises();
                
                if (success) {
                    setExercises([]);
                    showNotification("success", "All exercise records deleted successfully");
                } else {
                    showNotification("error", "Failed to delete all exercise records");
                    handleRefresh(); // Refresh to restore correct state
                }
            } catch (error) {
                console.error("Error deleting all exercises:", error);
                showNotification("error", "Failed to delete all exercise records");
                handleRefresh();
            }
        }
    };
    
    const showNotification = (type, message) => {
        setNotification({ type, message });
        
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };
    
    const handleRefresh = () => {
        const allExercises = getExercises();
        setExercises(allExercises);
        
        const grouped = groupExercisesByTypeAndDate(allExercises);
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
    
    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
           
            {notification && (
                <div 
                    className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-3 pr-4 shadow-md transition-all ${
                        notification.type === "success" ? "bg-green-100 text-green-800" : 
                        notification.type === "warning" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
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
                    ) : notification.type === "warning" ? (
                        <div className="flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5" />
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
                <h2 className="text-xl font-bold">RepBot Log</h2>
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
            
            {(!exercises || exercises.length === 0) ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <p className="text-slate-600">No RepBot records found.</p>
                    <p className="text-sm text-slate-500">Complete exercises using the RepBot to see your activity here.</p>
                    <Link to="/repbot" className="mt-3 text-sm font-medium text-[#1e628c] hover:underline">
                        Go to RepBot
                    </Link>
                 </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {groupedExercises.map((group) => (
                            <div key={group.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${getExerciseColor(group.exerciseType)}`}>
                                                <DumbbellIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-slate-900">
                                                    {formatExerciseType(group.exerciseType)}
                                                </h3>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteExerciseGroup(e, group)}
                                            className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                            title="Delete this exercise record"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-[#1e628c]">
                                                {group.totalReps}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                Total Reps
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(group.timestamp)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {!expandedView && groupedExercises.length > maxItems && groupedExercises.length > 1 && (
                        <button
                            onClick={() => setExpandedView(true)}
                            className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Show All ({groupedExercises.length}) Exercise Sessions
                        </button>
                    )}
                    
                    <div className="mt-4 text-center">
                        <Link 
                            to="/repbot"
                            className="text-sm font-medium text-[#1e628c] hover:underline"
                        >
                            Go to RepBot
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};
