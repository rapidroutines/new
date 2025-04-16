import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";
import { BookmarkPlus, BookmarkCheck, Search, X, Info } from "lucide-react";
import { useSavedExercises } from "@/contexts/saved-exercises-context";
import { useAuth } from "@/contexts/auth-context";
import pushUpsImage from "@/assets/pseudo-planche-push-ups.png";
import declinepushUpsImage from "@/assets/decline-push-ups.png";
import pistolSquatsImage from "@/assets/pistol-squats.png";
import hollowbodyHoldImage from "@/assets/hollow-body-hold.png";
import straddlePlancheImage from "@/assets/straddle-planche.png";
import dragonFlagImage from "@/assets/dragon-flag.png";
import cossackSquatHoldImage from "@/assets/cossack-squat-hold.png";
import deadHangImage from "@/assets/dead-hang.png";
import lsitImage from "@/assets/l-sit.png";
import chestsStretchImage from "@/assets/chest-stretch.png";
import straightarmBackwardsStretchImage from "@/assets/straight-arm-backwards-stretch.png";
import supinatedPushUpsImage from "@/assets/supinated-push-ups.png";
import benchDipsImage from "@/assets/bench-dips.png";
import frontLeverImage from "@/assets/front-lever.png";
import plancheLeanImage from "@/assets/planche-lean.png";
import frogPoseImage from "@/assets/frog-pose.png";

// Import placeholders for new exercise images
import russianTwistImage from "@/assets/russian-twists.png"; 
import alternateHeelTouchesImage from "@/assets/alternate-heel-touches.png"; 
import sidePlankImage from "@/assets/side-plank.png"; 
import sideObliqueRaisesImage from "@/assets/side-oblique-raises.png"; 
import scissorsImage from "@/assets/scissors.png"; 
import hipFlexorStretchImage from "@/assets/hip-flexors.png"; 
import downwardDogImage from "@/assets/downward-dog.png"; 
import worldsGreatestStretchImage from "@/assets/worlds-greatest-stretch.png"; 
import butterflyImage from "@/assets/butterfly.png"; 

// Exercise data with added core and mobility exercises
const exercises = [
    {
        id: 1,
        title: "Pseudo Planche Push-up",
        category: "calisthenics",
        description: "A compound exercise that works the chest, shoulders, triceps, and core muscles.",
        difficulty: 2,
        image: pushUpsImage,
        sets: "3-4",
        reps: "8-12",
        tips: [
            "Position hands at waist level",
            "Lean body weight forward",
            "Keep elbows close to body",
            "Maintain hollow body position"
        ]
    },
    {
        id: 2,
        title: "Decline Push-up",
        category: "calisthenics",
        description: "An upper body exercise that targets the chest and triceps.",
        difficulty: 1,
        image: declinepushUpsImage,
        sets: "3-4",
        reps: "10-15",
        tips: [
            "Elevate feet on stable surface",
            "Keep body in straight line",
            "Lower chest to floor",
            "Keep core engaged"
        ]
    },
    {
        id: 3,
        title: "Pistol Squats",
        category: "calisthenics",
        description: "A lower body exercise focusing on the quadriceps, hamstrings, and glutes.",
        difficulty: 2,
        image: pistolSquatsImage,
        sets: "3",
        reps: "5-8 per leg",
        tips: [
            "Start with support if needed",
            "Keep heel on ground",
            "Extend arms for balance",
            "Focus on controlled movement"
        ]
    },
    {
        id: 4,
        title: "Hollow Body Hold",
        category: "core",
        description: "A core exercise that targets the mid and low abdominals.",
        difficulty: 1,
        image: hollowbodyHoldImage,
        sets: "3",
        reps: "30-60 seconds",
        tips: [
            "Press lower back to floor",
            "Engage core throughout",
            "Extend arms overhead for more challenge",
            "Keep breathing steady"
        ]
    },
    {
        id: 5,
        title: "Straddle Planche",
        category: "calisthenics",
        description: "An isometric planche progression that requires tremendous strength.",
        difficulty: 3,
        image: straddlePlancheImage,
        sets: "3-5",
        reps: "5-10 seconds",
        tips: [
            "Start with tuck planche first",
            "Open legs wide for balance",
            "Push shoulders forward",
            "Engage all muscles"
        ]
    },
    {
        id: 6,
        title: "Dragon Flag",
        category: "core",
        description: "A core exercise that targets the rectus abdominis, obliques, and transverse abdominis.",
        difficulty: 3,
        image: dragonFlagImage,
        sets: "3",
        reps: "5-8",
        tips: [
            "Keep body straight",
            "Support upper body position",
            "Lower with control",
            "Don't allow back to arch"
        ]
    },
    {
        id: 7,
        title: "Cossack Squat Hold",
        category: "mobility",
        description: "A deep lateral squat shifting weight from one leg to the other.",
        difficulty: 1,
        image: cossackSquatHoldImage,
        sets: "2-3",
        reps: "30-60 seconds per side",
        tips: [
            "Keep chest up",
            "Extend one leg fully",
            "Sink into active hip",
            "Progress movement depth over time"
        ]
    },
    {
        id: 8,
        title: "Dead Hangs",
        category: "mobility",
        description: "A grip-strength exercise where you hang from a bar with arms fully extended.",
        difficulty: 1,
        image: deadHangImage,
        sets: "3-4",
        reps: "30-60 seconds",
        tips: [
            "Fully relax shoulders",
            "Engage core slightly",
            "Breathe deeply",
            "Progress to active hangs"
        ]
    },
    {
        id: 9,
        title: "L sit",
        category: "calisthenics",
        description: "A core-intensive hold where you support yourself on parallel bars or the floor with legs extended straight in front.",
        difficulty: 2,
        image: lsitImage,
        sets: "3-5",
        reps: "10-30 seconds",
        tips: [
            "Push shoulders down",
            "Point toes",
            "Keep legs straight",
            "Start on raised surface if needed"
        ]
    },
    {
        id: 10,
        title: "One Arm Chest Stretch",
        category: "mobility",
        description: "A stretch where one arm is extended against a wall or surface to open up the chest and shoulders.",
        difficulty: 1,
        image: chestsStretchImage,
        sets: "2-3",
        reps: "30-60 seconds per side",
        tips: [
            "Place arm at 90 degrees",
            "Rotate torso away from arm",
            "Feel stretch across chest",
            "Don't force the stretch"
        ]
    },
    {
        id: 11,
        title: "Straight Arm Backwards Stretch",
        category: "mobility",
        description: "A stretch where you extend your arms straight back to open the chest and shoulders.",
        difficulty: 1,
        image: straightarmBackwardsStretchImage,
        sets: "2-3",
        reps: "30-60 seconds",
        tips: [
            "Keep arms straight",
            "Interlace fingers behind back",
            "Lift arms up and back",
            "Keep chest open"
        ]
    },
    {
        id: 12,
        title: "Supinated Push Ups",
        category: "calisthenics",
        description: "A push-up variation where your hands are turned palms-up, engaging the biceps and wrists more.",
        difficulty: 1,
        image: supinatedPushUpsImage,
        sets: "3",
        reps: "8-12",
        tips: [
            "Start with wrist prep",
            "Keep elbows close to body",
            "Don't flare elbows",
            "Protect wrists"
        ]
    },
    {
        id: 13,
        title: "Bench Dips",
        category: "calisthenics",
        description: "A triceps-focused exercise where you lower and raise your body using a bench for support.",
        difficulty: 1,
        image: benchDipsImage,
        sets: "3",
        reps: "10-15",
        tips: [
            "Use stable surface",
            "Keep elbows pointing back",
            "Lower until arms are at 90°",
            "Keep shoulders down"
        ]
    },
    {
        id: 14,
        title: "Front Lever",
        category: "calisthenics",
        description: "A full-body strength hold where you hang from a bar and keep your body straight and horizontal.",
        difficulty: 3,
        image: frontLeverImage,
        sets: "3-5",
        reps: "5-10 seconds",
        tips: [
            "Start with tuck position",
            "Engage lats and core",
            "Keep arms straight",
            "Progress gradually"
        ]
    },
    {
        id: 15,
        title: "Planche Lean",
        category: "calisthenics",
        description: "A strength exercise where you lean forward in a push-up position, shifting weight onto your hands to build planche strength.",
        difficulty: 1,
        image: plancheLeanImage,
        sets: "3",
        reps: "30-60 seconds",
        tips: [
            "Lean forward from ankles",
            "Keep arms straight",
            "Protract shoulder blades",
            "Engage core fully"
        ]
    },
    {
        id: 16,
        title: "Frog Pose",
        category: "calisthenics",
        description: "A deep hip-opening stretch where you rest on your hands or forearms with knees wide apart.",
        difficulty: 1,
        image: frogPoseImage,
        sets: "2-3",
        reps: "30-60 seconds",
        tips: [
            "Keep knees and ankles aligned",
            "Don't force the position",
            "Breathe into the stretch",
            "Modify with pillows if needed"
        ]
    },
    // NEW CORE EXERCISES
    {
        id: 17,
        title: "Russian Twist",
        category: "core",
        description: "A rotational exercise that targets the obliques and abdominal muscles by twisting the torso from side to side.",
        difficulty: 1,
        image: russianTwistImage,
        sets: "3",
        reps: "10-15 per side",
        tips: [
            "Sit with knees bent",
            "Lean back slightly",
            "Keep back straight",
            "Rotate from core, not arms"
        ]
    },
    {
        id: 18,
        title: "Alternate Heel Touches",
        category: "core",
        description: "A core exercise where you lie on your back, bend your knees, and reach side to side to tap your heels, engaging the obliques with each repetition.",
        difficulty: 1,
        image: alternateHeelTouchesImage,
        sets: "3",
        reps: "12-20 per side",
        tips: [
            "Keep lower back pressed to floor",
            "Lift shoulders slightly off ground",
            "Move slowly and controlled",
            "Focus on oblique engagement"
        ]
    },
    {
        id: 19,
        title: "Side Plank",
        category: "core",
        description: "A core-strengthening exercise that targets the obliques, shoulders, and hips by holding the body in a straight line on one side using the forearm or hand for support.",
        difficulty: 1,
        image: sidePlankImage,
        sets: "2-3",
        reps: "30-60 seconds per side",
        tips: [
            "Stack feet or stagger them",
            "Lift hips high",
            "Maintain straight line",
            "Keep free arm extended or on hip"
        ]
    },
    {
        id: 20,
        title: "Side Oblique Raises",
        category: "core",
        description: "A core exercise that strengthens the obliques by lifting the torso sideways.",
        difficulty: 1,
        image: sideObliqueRaisesImage,
        sets: "3",
        reps: "10-15 per side",
        tips: [
            "Lie on side with legs stacked",
            "Support head with bottom arm",
            "Lift upper body with obliques",
            "Avoid using momentum"
        ]
    },
    {
        id: 21,
        title: "Scissors",
        category: "core",
        description: "A core and hip workout where you lie on your back and alternate raising and lowering your legs in a crisscross 'scissor' motion, keeping them straight and off the ground.",
        difficulty: 1,
        image: scissorsImage,
        sets: "3",
        reps: "10-15 per side",
        tips: [
            "Press lower back to floor",
            "Keep legs straight",
            "Move with control",
            "Lower legs only as far as you maintain form"
        ]
    },
    // NEW MOBILITY EXERCISES
    {
        id: 22,
        title: "Hip Flexor Stretch",
        category: "mobility",
        description: "A stretch targeting the hip flexors to improve hip extension, reduce lower back pain, and enhance posture.",
        difficulty: 1,
        image: hipFlexorStretchImage,
        sets: "2-3",
        reps: "30-60 seconds per side",
        tips: [
            "Kneel with one leg forward at 90°",
            "Keep torso upright",
            "Squeeze glute on stretching side",
            "Gently shift weight forward"
        ]
    },
    {
        id: 23,
        title: "Downward Dog",
        category: "mobility",
        description: "A yoga pose that stretches the shoulders, hamstrings, calves, and arches of the feet while strengthening the arms and legs.",
        difficulty: 1,
        image: downwardDogImage,
        sets: "2-3",
        reps: "30-60 seconds",
        tips: [
            "Form inverted V shape",
            "Press heels toward floor",
            "Rotate arms so inner elbows face each other",
            "Lengthen spine"
        ]
    },
    {
        id: 24,
        title: "World's Greatest Stretch",
        category: "mobility",
        description: "A comprehensive mobility exercise that targets hips, thoracic spine, and shoulders in one fluid sequence.",
        difficulty: 2,
        image: worldsGreatestStretchImage,
        sets: "2-3",
        reps: "5-8 per side",
        tips: [
            "Start in lunge position",
            "Place hand on floor inside front foot",
            "Rotate and open toward front leg",
            "Perform as a flowing sequence"
        ]
    },
    {
        id: 25,
        title: "Butterfly",
        category: "mobility",
        description: "A seated stretch that targets the inner thighs and hips by bringing the soles of the feet together and allowing the knees to drop outward.",
        difficulty: 1,
        image: butterflyImage,
        sets: "2-3",
        reps: "30-60 seconds",
        tips: [
            "Sit tall with feet together",
            "Allow knees to drop outward",
            "Gently press knees with hands",
            "Lean forward for deeper stretch"
        ]
    }
];

// Custom color variable for the requested blue shade
const customBlue = "#1e628c";

const LibraryPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [filteredExercises, setFilteredExercises] = useState(exercises);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const { isAuthenticated } = useAuth();
    const { addSavedExercise, removeSavedExercise, isSaved } = useSavedExercises();
    
    // Handle save/unsave function
const handleSaveToggle = (e, exercise) => {
    e.stopPropagation();
    
    if (isSaved(exercise.id)) {
        removeSavedExercise(exercise.id);
    } else {
        addSavedExercise(exercise);
    }
};
    
    // Show exercise details modal
    const showExerciseDetails = (exercise) => {
        setSelectedExercise(exercise);
    };
    
    // Close exercise details modal
    const closeExerciseDetails = () => {
        setSelectedExercise(null);
    };
    
    // Update document title for better SEO and user experience
    useEffect(() => {
        document.title = "RapidRoutines - Exercise Library";
    }, []);
    
    // Filter exercises based on active category and search query
    useEffect(() => {
        let filtered = exercises;
        
        // Filter by category first
        if (activeCategory !== 'all') {
            filtered = filtered.filter(exercise => exercise.category === activeCategory);
        }
        
        // Then apply search filter if there's a query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(exercise => 
                exercise.title.toLowerCase().includes(query) || 
                exercise.description.toLowerCase().includes(query)
            );
        }
        
        setFilteredExercises(filtered);
    }, [activeCategory, searchQuery]);

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="title">Exercise Library</h1>
                
                {/* Search input */}
                <div className="relative w-full max-w-sm">
                    <div className="flex h-10 w-full items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                        <div className="flex h-full items-center justify-center px-3">
                            <Search className="h-4 w-4 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-full flex-1 bg-transparent px-2 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-4">
                <button 
                    onClick={() => setActiveCategory('all')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'all' 
                            ? "bg-[#1e628c] text-white" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'all' ? customBlue : '' }}
                >
                    All Exercises
                </button>
                <button 
                    onClick={() => setActiveCategory('calisthenics')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'calisthenics' 
                            ? "bg-[#1e628c] text-white" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'calisthenics' ? customBlue : '' }}
                >
                    Calisthenics
                </button>
                <button 
                    onClick={() => setActiveCategory('mobility')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'mobility' 
                            ? "bg-[#1e628c] text-white" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'mobility' ? customBlue : '' }}
                >
                    Mobility
                </button>
                <button 
                    onClick={() => setActiveCategory('core')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'core' 
                            ? "bg-[#1e628c] text-white" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'core' ? customBlue : '' }}
                >
                    Core
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((exercise) => (
                    <div 
                        key={exercise.id} 
                        className="card group cursor-pointer" 
                        onClick={() => showExerciseDetails(exercise)}
                    >
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                            <img 
                                src={exercise.image} 
                                alt={exercise.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div 
                                className="absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-bold text-white"
                                style={{
                                    backgroundColor: 
                                        exercise.category === 'calisthenics' ? customBlue : 
                                        exercise.category === 'mobility' ? "#10b981" : "#f97316"
                                }}
                            >
                                {exercise.category}
                            </div>
                            
                            {/* Save button */}
                            <button
                                onClick={(e) => handleSaveToggle(e, exercise)}
                                className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition-colors hover:bg-white"
                                title={isSaved(exercise.id) ? "Remove from saved" : "Save exercise"}
                            >
                                {isSaved(exercise.id) ? (
                                    <BookmarkCheck className="h-5 w-5 text-[#1e628c]" />
                                ) : (
                                    <BookmarkPlus className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        
                        <div className="p-4">
                            <h3 className="card-title text-lg">{exercise.title}</h3>
                            <p className="mt-2 text-sm text-slate-600">{exercise.description}</p>
                            
                            <div className="mt-4 flex items-center">
                                <div className="mr-3 flex items-center gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <span 
                                            key={level}
                                            className={cn(
                                                "h-2 w-2 rounded-full",
                                                level <= exercise.difficulty 
                                                    ? "bg-slate-500" 
                                                    : "bg-slate-200"
                                            )}
                                            style={{
                                                backgroundColor: level <= exercise.difficulty 
                                                    ? customBlue 
                                                    : "#e2e8f0"
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-slate-500">
                                    {exercise.difficulty === 1 ? 'Beginner' : 
                                     exercise.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No results message when filters return empty */}
            {filteredExercises.length === 0 && (
                <div className="py-8 text-center">
                    <p className="text-slate-600">
                        {searchQuery 
                            ? `No exercises found matching "${searchQuery}" in ${activeCategory === 'all' ? 'any category' : `the ${activeCategory} category`}.` 
                            : `No exercises found in this category.`}
                    </p>
                    <button
                        onClick={() => {
                            setActiveCategory('all');
                            setSearchQuery('');
                        }}
                        className="mt-4 text-[#1e628c] hover:underline"
                    >
                        View all exercises
                    </button>
                </div>
            )}

            {/* Exercise Details Modal */}
            {selectedExercise && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeExerciseDetails}>
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-0" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header with Image */}
                        <div className="relative h-56 w-full">
                            <img 
                                src={selectedExercise.image} 
                                alt={selectedExercise.title} 
                                className="h-full w-full object-cover"
                            />
                            
                            {/* Category Badge */}
                            <div 
                                className="absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-white"
                                style={{
                                    backgroundColor: 
                                        selectedExercise.category === 'calisthenics' ? customBlue : 
                                        selectedExercise.category === 'mobility' ? "#10b981" : "#f97316"
                                }}
                            >
                                {selectedExercise.category}
                            </div>
                            
                            {/* Close Button */}
                            <button 
                                className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-slate-800 hover:bg-white"
                                onClick={closeExerciseDetails}
                            >
                                <X className="h-5 w-5" />
                            </button>
                            
                            {/* Save Button */}
                            <button
                                onClick={(e) => handleSaveToggle(e, selectedExercise)}
                                className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium shadow-md transition-colors hover:bg-slate-50"
                            >
                                {isSaved(selectedExercise.id) ? (
                                    <>
                                        <BookmarkCheck className="h-4 w-4 text-[#1e628c]" />
                                        <span>Saved</span>
                                    </>
                                ) : (
                                    <>
                                        <BookmarkPlus className="h-4 w-4" />
                                        <span>Save</span>
                                    </>
                                )}
                            </button>
                            
                            {/* Difficulty indicator */}
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
                                                    ? customBlue 
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
                        
                        {/* Modal Content */}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-slate-900">{selectedExercise.title}</h2>
                            <p className="mt-2 text-slate-600">{selectedExercise.description}</p>
                            
                            {/* Exercise Recommendation */}
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
                            
                            {/* Tips Section */}
                            <div className="mt-6">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                    <Info className="h-5 w-5 text-[#1e628c]" />
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
                            
                            {/* Footer */}
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

            <Footer />
        </div>
    );
};

export default LibraryPage;
