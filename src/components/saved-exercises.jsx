import { useState } from "react";
import { useSavedExercises } from "@/contexts/saved-exercises-context";
import { Link } from "react-router-dom";
import { Dumbbell, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

export const SavedExercises = ({ maxItems = 4 }) => {
    const { savedExercises, removeSavedExercise, isLoading } = useSavedExercises();
    const [expandedView, setExpandedView] = useState(false);

    const exercisesToDisplay = expandedView
        ? savedExercises
        : savedExercises.slice(0, maxItems);

    const handleRemove = (e, exerciseId) => {
        e.stopPropagation();
        e.preventDefault();

        if (confirm("Are you sure you want to remove this exercise from your saved list?")) {
            removeSavedExercise(exerciseId);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            calisthenics: "bg-blue-100 text-blue-600",
            core: "bg-green-100 text-green-600",
            mobility: "bg-yellow-100 text-yellow-600",
        };
        return colors[category] || "bg-slate-100 text-slate-600";
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
                    <Dumbbell className="mb-2 h-8 w-8 text-slate-400" />
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
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Saved Exercises</h2>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {exercisesToDisplay.map((exercise) => (
                    <Link
                        key={exercise.id}
                        to="/library"
                        className="group relative flex overflow-hidden rounded-lg border border-slate-100"
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
                                    <h3 className="font-medium text-slate-800">{exercise.title}</h3>
                                    <button
                                        onClick={(e) => handleRemove(e, exercise.id)}
                                        className="opacity-0 transition-opacity group-hover:opacity-100"
                                        aria-label="Remove from saved"
                                    >
                                        <Trash2 className="h-4 w-4 text-slate-500" />
                                    </button>
                                </div>
                                <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                                    {exercise.description}
                                </p>
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
                    </Link>
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
        </div>
    );
};
