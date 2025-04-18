import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { useExercises } from "@/contexts/exercise-context";
import { useAuth } from "@/contexts/auth-context";
import { LimitedFunctionalityBanner } from "@/components/limited-functionality-banner";
import { Dumbbell, Calendar, Clock, Weight, Trash2, Ban, Check, AlertCircle } from "lucide-react";

const ExerciseTrackerPage = ({ limited = false }) => {
    const { isAuthenticated } = useAuth();
    const { 
        getExercises, 
        addExercise, 
        deleteExercise,
        deleteAllExercises, 
        isLoading 
    } = useExercises();
    
    const [exercises, setExercises] = useState([]);
    const [formData, setFormData] = useState({
        exercise: "Push-ups",
        sets: "",
        reps: "",
        time: "",
        weight: "",
        weightUnit: "kg",
        date: new Date().toISOString().split('T')[0]
    });
    const [showTimedInput, setShowTimedInput] = useState(false);
    const [notification, setNotification] = useState(null);

    // List of exercises that are timed
    const timedExercises = [
        "Planks", "Tuck Planche", "Straddle Planche", "Crow Pose", "Frog Pose", 
        "Front Lever", "Back Lever", "Dragon Flag", "Human Flag", "Side Plank", 
        "Wall Sit", "Superman Hold", "L-sit Hold", "V-sit Hold", "Handstand Holds"
    ];

    // Load exercises on component mount
    useEffect(() => {
        setExercises(getExercises());
    }, [getExercises]);

    // Check if current exercise is timed when it changes
    useEffect(() => {
        setShowTimedInput(timedExercises.includes(formData.exercise));
    }, [formData.exercise]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (showTimedInput && !formData.time) {
            showNotification("error", "Please enter time for this exercise");
            return;
        }

        if (!showTimedInput && (!formData.sets || !formData.reps)) {
            showNotification("error", "Please enter sets and reps");
            return;
        }

        // Prepare exercise data
        const exerciseData = {
            exercise: formData.exercise,
            sets: formData.sets,
            reps: formData.reps,
            time: formData.time,
            weight: formData.weight || "Bodyweight",
            weightUnit: formData.weightUnit,
            date: formData.date
        };

        // Add exercise
        const success = await addExercise(exerciseData);
        
        if (success) {
            // Update local exercises list
            setExercises(getExercises());
            
            // Reset form (except exercise type and date)
            setFormData({
                ...formData,
                sets: "",
                reps: "",
                time: "",
                weight: ""
            });
            
            showNotification("success", "Exercise added successfully!");
        } else if (!isAuthenticated) {
            showNotification("warning", "Exercise saved locally. Sign in to save to your account.");
        } else {
            showNotification("error", "Failed to save exercise. Please try again.");
        }
    };

    const handleDeleteExercise = async (id) => {
        if (window.confirm("Are you sure you want to delete this exercise?")) {
            const success = await deleteExercise(id);
            
            if (success) {
                setExercises(getExercises());
                showNotification("success", "Exercise deleted successfully!");
            } else {
                showNotification("error", "Failed to delete exercise. Please try again.");
            }
        }
    };

    const handleDeleteAllExercises = async () => {
        if (window.confirm("Are you sure you want to delete ALL exercises? This cannot be undone.")) {
            const success = await deleteAllExercises();
            
            if (success) {
                setExercises([]);
                showNotification("success", "All exercises deleted successfully!");
            } else {
                showNotification("error", "Failed to delete exercises. Please try again.");
            }
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    };

    const getExerciseTypeIcon = (exerciseType) => {
        if (timedExercises.includes(exerciseType)) {
            return <Clock className="h-5 w-5 text-blue-500" />;
        }
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow flex flex-col gap-y-4 p-4">
                {limited && !isAuthenticated && (
                    <LimitedFunctionalityBanner featureName="Exercise Tracker" />
                )}
                
                {notification && (
                    <div 
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-3 pr-4 shadow-md transition-all 
                            ${notification.type === "success" ? "bg-green-100 text-green-800" : 
                              notification.type === "warning" ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"}`}
                    >
                        {notification.type === "success" ? (
                            <Check className="h-5 w-5" />
                        ) : notification.type === "warning" ? (
                            <AlertCircle className="h-5 w-5" />
                        ) : (
                            <Ban className="h-5 w-5" />
                        )}
                        <span>{notification.message}</span>
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Exercise Input Form */}
                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Add Exercise</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Exercise
                                </label>
                                <select
                                    id="exercise"
                                    value={formData.exercise}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                >
                                    <option>Push-ups</option>
                                    <option>Pull-ups</option>
                                    <option>Squats</option>
                                    <option>Dips</option>
                                    <option>Planks</option>
                                    <option>Burpees</option>
                                    <option>Jump Rope</option>
                                    <option>Deadlifts</option>
                                    <option>Bench Press</option>
                                    <option>Tuck Planche</option>
                                    <option>Straddle Planche</option>
                                    <option>Crow Pose</option>
                                    <option>Frog Pose</option>
                                    <option>Front Lever</option>
                                    <option>Muscle Ups</option>
                                    <option>Pistol Squats</option>
                                    <option>Dragon Squats</option>
                                    <option>One Arm Push-ups</option>
                                    <option>Clap Push-ups</option>
                                    <option>Back Lever</option>
                                    <option>Pike Press</option>
                                    <option>Dragon Flag</option>
                                    <option>Human Flag</option>
                                    <option>Side Plank</option>
                                    <option>Inverted Rows</option>
                                    <option>Ring Dips</option>
                                    <option>Leg Raises</option>
                                    <option>Barbell Rows</option>
                                    <option>Chin-ups</option>
                                    <option>Incline Push-ups</option>
                                    <option>Hip Thrusts</option>
                                    <option>Tricep Dips</option>
                                    <option>Wall Sit</option>
                                    <option>Superman Hold</option>
                                    <option>Jumping Lunges</option>
                                    <option>Mountain Climbers</option>
                                    <option>Glute Bridges</option>
                                    <option>Box Jumps</option>
                                    <option>Squat Jumps</option>
                                    <option>Archer Pull-ups</option>
                                    <option>Archer Push-ups</option>
                                    <option>Wide Push-ups</option>
                                    <option>Decline Push-ups</option>
                                    <option>Handstand Push-ups</option>
                                    <option>Pistol Squats (Assisted)</option>
                                    <option>Bulgarian Split Squats</option>
                                    <option>Wall Walks</option>
                                    <option>Planche Push-ups</option>
                                    <option>L-sit Hold</option>
                                    <option>V-sit Hold</option>
                                    <option>Human Flag (Progression)</option>
                                    <option>Front Lever Progression</option>
                                    <option>Back Lever Progression</option>
                                    <option>Muscle-up Progression</option>
                                    <option>Shoulder Taps</option>
                                    <option>Dip Bar Leg Raises</option>
                                    <option>Isometric Pull-up Hold</option>
                                    <option>Handstand Holds</option>
                                </select>
                            </div>
                            
                            {!showTimedInput && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Sets
                                        </label>
                                        <input
                                            type="number"
                                            id="sets"
                                            value={formData.sets}
                                            onChange={handleInputChange}
                                            placeholder="Number of sets"
                                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Reps
                                        </label>
                                        <input
                                            type="number"
                                            id="reps"
                                            value={formData.reps}
                                            onChange={handleInputChange}
                                            placeholder="Reps per set"
                                            className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        />
                                    </div>
                                </>
                            )}
                            
                            {showTimedInput && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Time (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        id="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        placeholder="Duration in seconds"
                                        className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                    />
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Weight (leave empty for bodyweight)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        id="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        placeholder="Weight"
                                        className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                    />
                                    <select
                                        id="weightUnit"
                                        value={formData.weightUnit}
                                        onChange={handleInputChange}
                                        className="w-24 rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="lbs">lbs</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-[#1e628c] py-2.5 text-center font-medium text-white hover:bg-[#17516f] focus:outline-none focus:ring-2 focus:ring-[#1e628c] focus:ring-offset-2"
                            >
                                Add Exercise
                            </button>
                        </form>
                    </div>
                    
                    {/* Exercise List */}
                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Your Exercises</h2>
                            
                            {exercises.length > 0 && (
                                <button
                                    onClick={handleDeleteAllExercises}
                                    className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                                    title="Delete all exercises"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete All</span>
                                </button>
                            )}
                        </div>
                        
                        {isLoading ? (
                            <div className="flex h-40 items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e628c]"></div>
                            </div>
                        ) : exercises.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                                <Dumbbell className="mb-2 h-8 w-8 text-slate-400" />
                                <p className="text-slate-600">No exercises recorded yet.</p>
                                <p className="text-sm text-slate-500">Add your first exercise using the form.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {exercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                                    {getExerciseTypeIcon(exercise.exercise)}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-slate-900">{exercise.exercise}</h3>
                                                    {timedExercises.includes(exercise.exercise) ? (
                                                        <p className="text-sm text-slate-600">
                                                            <span className="font-medium">Time:</span> {exercise.time} seconds
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-slate-600">
                                                            <span className="font-medium">Sets:</span> {exercise.sets}, <span className="font-medium">Reps:</span> {exercise.reps}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleDeleteExercise(exercise.id)}
                                                className="text-slate-400 hover:text-red-500"
                                                title="Delete exercise"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        
                                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Weight className="h-3.5 w-3.5" />
                                                <span>
                                                    {exercise.weight === "Bodyweight" 
                                                        ? "Bodyweight" 
                                                        : `${exercise.weight} ${exercise.weightUnit}`}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{formatDate(exercise.date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ExerciseTrackerPage;