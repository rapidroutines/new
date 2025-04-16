import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { X, Info, CheckCircle, Lock, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";

const initializeExerciseCategories = () => {
    const categories = {
        push: [
            { id: 'inclinePushUp', title: 'Incline Push-Ups', icon: 'IP', level: 'Beginner', isCompleted: false, isLocked: false },
            { id: 'kneelingPushUp', title: 'Kneeling Push-Ups', icon: 'KP', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'pushUp', title: 'Regular Push-Ups', icon: 'P', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'widePushUp', title: 'Wide Push-Ups', icon: 'W', level: 'Beginner-Int', isCompleted: false, isLocked: true },
            { id: 'declinePushUp', title: 'Decline Push-Ups', icon: 'DP', level: 'Beginner-Int', isCompleted: false, isLocked: true },
            { id: 'diamondPushUp', title: 'Diamond Push-Ups', icon: 'D', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'pseudoPlanche', title: 'Pseudo Planche Push-Ups', icon: 'PP', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'pikePushUp', title: 'Pike Push-Ups', icon: 'PK', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'wallHsPushUp', title: 'Wall Handstand Push-Ups', icon: 'WH', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'archPushUp', title: 'Archer Push-Ups', icon: 'AP', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'ringPushUp', title: 'Ring Push-Ups', icon: 'RP', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'handstandPushUp', title: 'Handstand Push-Ups', icon: 'HS', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'oneArmPushup', title: 'One-Arm Push-Ups', icon: 'OA', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'planchePushUp', title: 'Planche Push-Ups', icon: 'PL', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'maltese', title: 'Maltese Push-Ups', icon: 'M', level: 'Elite', isCompleted: false, isLocked: true }
        ],
        pull: [
            { id: 'scapulaPull', title: 'Scapula Pulls', icon: 'SC', level: 'Beginner', isCompleted: false, isLocked: false },
            { id: 'activeHang', title: 'Active Hangs', icon: 'AH', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'negPullUp', title: 'Negative Pull-Ups', icon: 'NP', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'australianPull', title: 'Australian Pull-Ups', icon: 'AU', level: 'Beginner-Int', isCompleted: false, isLocked: true },
            { id: 'chinUp', title: 'Chin-Ups', icon: 'C', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'pullUp', title: 'Pull-Ups', icon: 'P', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'widePullUp', title: 'Wide-Grip Pull-Ups', icon: 'WP', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'lSitPullUp', title: 'L-Sit Pull-Ups', icon: 'LP', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'archPullUp', title: 'Archer Pull-Ups', icon: 'A', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'typeWriter', title: 'Typewriter Pull-Ups', icon: 'TW', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'clappingPull', title: 'Clapping Pull-Ups', icon: 'CP', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'muscleUp', title: 'Muscle-Ups', icon: 'MU', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'oneArmPull', title: 'One-Arm Pull-Ups', icon: 'OA', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'frontLeverPull', title: 'Front Lever Pull-Ups', icon: 'FL', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'oneArmMuscleUp', title: 'One-Arm Muscle-Up', icon: 'OM', level: 'Elite', isCompleted: false, isLocked: true }
        ],
        legs: [
            { id: 'assistSquat', title: 'Assisted Squats', icon: 'AS', level: 'Beginner', isCompleted: false, isLocked: false },
            { id: 'squat', title: 'Air Squats', icon: 'S', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'lunge', title: 'Forward Lunges', icon: 'L', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'sideLunge', title: 'Side Lunges', icon: 'SL', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'calfRaise', title: 'Calf Raises', icon: 'CR', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'bulgarianSquat', title: 'Bulgarian Split Squats', icon: 'BS', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'jumpSquat', title: 'Jump Squats', icon: 'JS', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'deepSquat', title: 'Deep Squats', icon: 'DS', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'walljumpSquat', title: 'Cossack Squats', icon: 'CS', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'singleLegCalfRaise', title: 'Single-Leg Calf Raises', icon: 'SC', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'singleLegBridge', title: 'Single-Leg Bridges', icon: 'SB', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'shrimpsquat', title: 'Shrimp Squats', icon: 'SS', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'pistolSquat', title: 'Pistol Squats', icon: 'PS', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'naturalLegExt', title: 'Natural Leg Extensions', icon: 'NL', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'deepPistolSquat', title: 'Deep Pistol Squats', icon: 'DP', level: 'Elite', isCompleted: false, isLocked: true }
        ],
        core: [
            { id: 'deadBug', title: 'Dead Bug', icon: 'DB', level: 'Beginner', isCompleted: false, isLocked: false },
            { id: 'plank', title: 'Plank', icon: 'P', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'kneeRaise', title: 'Knee Raises', icon: 'KR', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'mountainClimber', title: 'Mountain Climbers', icon: 'MC', level: 'Beginner', isCompleted: false, isLocked: true },
            { id: 'windshieldWiper', title: 'Windshield Wipers', icon: 'WW', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'sidePlank', title: 'Side Plank', icon: 'SP', level: 'Beginner-Int', isCompleted: false, isLocked: true },
            { id: 'legRaise', title: 'Hanging Leg Raises', icon: 'LR', level: 'Beginner-Int', isCompleted: false, isLocked: true },
            { id: 'hollowHold', title: 'Hollow Body Hold', icon: 'HH', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'lsit', title: 'L-Sit', icon: 'LS', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'abWheel', title: 'Ab Wheel Rollout', icon: 'AW', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'dragonFlag', title: 'Dragon Flag', icon: 'DF', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'backLever', title: 'Back Lever', icon: 'BL', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'frontLever', title: 'Front Lever', icon: 'FL', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'vSit', title: 'V-Sit', icon: 'VS', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'manna', title: 'Manna', icon: 'MA', level: 'Elite', isCompleted: false, isLocked: true }
        ],
        mobility: [
            { id: 'neckRotation', title: 'Neck Rotations', icon: 'NR', level: 'All Levels', isCompleted: false, isLocked: false },
            { id: 'wristMob', title: 'Wrist Mobility', icon: 'WM', level: 'All Levels', isCompleted: false, isLocked: true },
            { id: 'shoulderMob', title: 'Shoulder Mobility', icon: 'SM', level: 'All Levels', isCompleted: false, isLocked: true },
            { id: 'thoracicRotation', title: 'Thoracic Rotations', icon: 'TR', level: 'All Levels', isCompleted: false, isLocked: true },
            { id: 'catCow', title: 'Cat-Cow Stretch', icon: 'CC', level: 'All Levels', isCompleted: false, isLocked: true },
            { id: 'hipMob', title: 'Hip Mobility', icon: 'HM', level: 'All Levels', isCompleted: false, isLocked: true },
            { id: 'butterflyStretch', title: 'Butterfly Stretch', icon: 'BS', level: 'All Levels', isCompleted: false, isLocked: true },
            { id: 'spinalFlex', title: 'Spinal Flexibility', icon: 'SF', level: 'All Levels', isCompleted: false, isLocked: true },
            { id: 'ankleMob', title: 'Ankle Mobility', icon: 'AM', level: 'All Levels', isCompleted: false, isLocked: true },
            { id: 'germanHang', title: 'German Hang', icon: 'GH', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'chestStretch', title: 'Deep Chest Stretch', icon: 'CS', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'pancake', title: 'Pancake Stretch', icon: 'PS', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'frontSplit', title: 'Front Split', icon: 'FS', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'middleSplit', title: 'Middle Split', icon: 'MS', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'bridgeStretch', title: 'Full Bridge', icon: 'FB', level: 'Advanced', isCompleted: false, isLocked: true }
        ],
        skills: [
            { id: 'ctw', title: 'Crow to Wall', icon: 'CW', level: 'Beginner', isCompleted: false, isLocked: false },
            { id: 'crow', title: 'Crow Pose', icon: 'CP', level: 'Beginner-Int', isCompleted: false, isLocked: true },
            { id: 'lsit', title: 'L-Sit', icon: 'LS', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'frogstand', title: 'Frog Stand', icon: 'FS', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'wallHandstand', title: 'Wall Handstand', icon: 'WH', level: 'Intermediate', isCompleted: false, isLocked: true },
            { id: 'handstand', title: 'Free Handstand', icon: 'HS', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'straddle', title: 'Straddle Planche', icon: 'SP', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'tuckedPlanche', title: 'Tuck Planche', icon: 'TP', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'advTuckPlanche', title: 'Advanced Tuck Planche', icon: 'AT', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'humanFlag', title: 'Human Flag', icon: 'HF', level: 'Advanced', isCompleted: false, isLocked: true },
            { id: 'backLever', title: 'Back Lever', icon: 'BL', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'frontLever', title: 'Front Lever', icon: 'FL', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'planche', title: 'Full Planche', icon: 'PL', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'icarusCross', title: 'Icarus Cross', icon: 'IC', level: 'Elite', isCompleted: false, isLocked: true },
            { id: 'victorianCross', title: 'Victorian Cross', icon: 'VC', level: 'Elite', isCompleted: false, isLocked: true }
        ]
    };

    Object.keys(categories).forEach(category => {
        if (categories[category].length > 0) {
            categories[category][0].isLocked = false;
            for (let i = 1; i < categories[category].length; i++) {
                categories[category][i].isLocked = true;
            }
        }
    });

    return categories;
};

const RapidTreePage = () => {
    const [activeCategory, setActiveCategory] = useState('push');
    const [exercises, setExercises] = useState(initializeExerciseCategories());
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [totalProgress, setTotalProgress] = useState(0);

    useEffect(() => {
        let completedCount = 0;
        let totalCount = 0;

        Object.keys(exercises).forEach(category => {
            exercises[category].forEach(exercise => {
                totalCount++;
                if (exercise.isCompleted) {
                    completedCount++;
                }
            });
        });

        const percentage = Math.floor((completedCount / totalCount) * 100);
        setTotalProgress(percentage);
    }, [exercises]);

    useEffect(() => {
        const savedProgress = localStorage.getItem('rapidTreeProgress');
        if (savedProgress) {
            try {
                const parsedProgress = JSON.parse(savedProgress);
                const updatedExercises = initializeExerciseCategories(); // Start with a fresh copy

                Object.keys(parsedProgress).forEach(category => {
                    if (updatedExercises[category]) {
                        parsedProgress[category].forEach(savedExercise => {
                            const index = updatedExercises[category].findIndex(ex => ex.id === savedExercise.id);
                            if (index !== -1) {
                                updatedExercises[category][index].isCompleted = savedExercise.isCompleted;
                            }
                        });

                        for (let i = 0; i < updatedExercises[category].length; i++) {
                            if (i === 0) {
                                updatedExercises[category][i].isLocked = false;
                                continue;
                            }

                            if (updatedExercises[category][i-1].isCompleted) {
                                updatedExercises[category][i].isLocked = false;
                            } else {
                                updatedExercises[category][i].isLocked = true;
                                for (let j = i+1; j < updatedExercises[category].length; j++) {
                                    if (!updatedExercises[category][j].isCompleted) {
                                        updatedExercises[category][j].isLocked = true;
                                    }
                                }
                                break;
                            }
                        }
                    }
                });

                setExercises(updatedExercises);
            } catch (error) {
                console.error('Error loading saved progress:', error);
            }
        }
    }, []);

    const saveProgress = () => {
        const progressData = {};

        Object.keys(exercises).forEach(category => {
            progressData[category] = exercises[category].map(exercise => ({
                id: exercise.id,
                isCompleted: exercise.isCompleted,
                isLocked: exercise.isLocked
            }));
        });

        localStorage.setItem('rapidTreeProgress', JSON.stringify(progressData));
    };

    const showExerciseDetails = (category, exerciseId) => {
        const exercise = exercises[category].find(ex => ex.id === exerciseId);
        if (exercise && !exercise.isLocked) {
            setSelectedExercise({...exercise, category});
        }
    };

    const completeExercise = (category, exerciseId) => {
        const updatedExercises = {...exercises};
        const index = updatedExercises[category].findIndex(ex => ex.id === exerciseId);

        if (index === -1 || updatedExercises[category][index].isCompleted) return;

        updatedExercises[category][index].isCompleted = true;

        if (index + 1 < updatedExercises[category].length) {
            updatedExercises[category][index + 1].isLocked = false;
        }

        setExercises(updatedExercises);
        setSelectedExercise(null);
        saveProgress();
    };

    const resetExercise = (category, exerciseId) => {
        const updatedExercises = {...exercises};
        const index = updatedExercises[category].findIndex(ex => ex.id === exerciseId);

        if (index === -1) return;
        
        const nextExerciseIndex = index + 1;
        const hasNextExercise = nextExerciseIndex < updatedExercises[category].length;
        
        if (!hasNextExercise || (hasNextExercise && !updatedExercises[category][nextExerciseIndex].isLocked)) {
            updatedExercises[category][index].isCompleted = false;
            
            if (hasNextExercise && !updatedExercises[category][nextExerciseIndex].isCompleted) {
                updatedExercises[category][nextExerciseIndex].isLocked = true;
                
                for (let i = nextExerciseIndex + 1; i < updatedExercises[category].length; i++) {
                    if (!updatedExercises[category][i].isCompleted) {
                        updatedExercises[category][i].isLocked = true;
                    } else {
                        break; 
                    }
                }
            }
            
            setExercises(updatedExercises);
            setSelectedExercise(null);
            saveProgress();
        } else {
            setSelectedExercise(null);
        }
    };

    const canResetExercise = (category, exerciseId) => {
        const index = exercises[category].findIndex(ex => ex.id === exerciseId);
        if (index === -1) return false;
        
        const nextExerciseIndex = index + 1;
        const hasNextExercise = nextExerciseIndex < exercises[category].length;
        
        return !hasNextExercise || (hasNextExercise && 
            !exercises[category][nextExerciseIndex].isLocked && 
            !exercises[category][nextExerciseIndex].isCompleted);
    };

    const getExerciseDescription = (exerciseId) => {
        const descriptions = {
            inclinePushUp: 'Easier push-up with hands elevated, reducing body weight resistance.',
            kneelingPushUp: 'Push-up performed from knees to reduce resistance for beginners.',
            pushUp: 'The standard push-up works the chest, shoulders, triceps, and core.',
            widePushUp: 'Push-ups with hands wider than shoulders to focus on chest muscles.',
            declinePushUp: 'Push-ups with feet elevated to target upper chest and shoulders.',
            diamondPushUp: 'Hands form a diamond shape to focus on triceps development.',
            pseudoPlanche: 'Hands positioned near hips with forward lean to build planche strength.',
            pikePushUp: 'Body forms an inverted V to shift focus to shoulders.',
            wallHsPushUp: 'Handstand push-ups using wall support for stability.',
            archPushUp: 'One arm moves outward during push-up for uneven resistance.',
            ringPushUp: 'Push-ups on gymnastic rings for increased stabilization.',
            handstandPushUp: 'Vertical push-ups in handstand position for shoulder strength.',
            oneArmPushup: 'Advanced push-up using only one arm for extreme strength.',
            planchePushUp: 'Push-ups performed in the horizontal planche position.',
            maltese: 'Extremely advanced hold with arms wide and body parallel to ground.',
            
            scapulaPull: 'Fundamental hanging exercise focusing on shoulder blade control.',
            activeHang: 'Hanging with engaged shoulders to build grip and shoulder stability.',
            negPullUp: 'Lowering from the top of a pull-up to build initial strength.',
            australianPull: 'Horizontal pulling with body at an angle under a bar.',
            chinUp: 'Vertical pull with palms facing you, emphasizing biceps.',
            pullUp: 'Vertical pull with palms away, focusing on back and lats.',
            widePullUp: 'Pull-ups with wide grip to target outer lats.',
            lSitPullUp: 'Pull-ups while holding legs extended horizontally.',
            archPullUp: 'One arm moves outward during the pull for varied resistance.',
            typeWriter: 'Horizontal sliding movement at the top of a pull-up.',
            clappingPull: 'Explosive pull-ups with a momentary release to clap.',
            muscleUp: 'Pull-up transitioning over the bar into a dip.',
            oneArmPull: 'Pull-up performed with only one arm.',
            frontLeverPull: 'Pulling while maintaining a horizontal body position.',
            oneArmMuscleUp: 'Single-arm transition from below to above the bar.',
            
            assistSquat: 'Supported squats to learn proper form and build initial strength.',
            squat: 'Basic squatting movement targeting quads, hamstrings, and glutes.',
            lunge: 'Step forward into a split stance, targeting legs individually.',
            sideLunge: 'Lateral movement targeting inner and outer thighs.',
            calfRaise: 'Rising onto toes to strengthen calf muscles.',
            bulgarianSquat: 'Single-leg squat with rear foot elevated for increased difficulty.',
            jumpSquat: 'Explosive squats with a jump at the top for power development.',
            deepSquat: 'Full-range squats going below parallel for mobility and strength.',
            walljumpSquat: 'Side-to-side squats working hip mobility and leg strength.',
            singleLegCalfRaise: 'Calf raises on one leg for increased resistance.',
            singleLegBridge: 'Hip raise using one leg to target glutes and hamstrings.',
            shrimpsquat: 'Single-leg squat with non-working leg held behind.',
            pistolSquat: 'One-legged squat with other leg extended forward.',
            naturalLegExt: 'Kneeling exercise focusing on quadriceps strength.',
            deepPistolSquat: 'Full-range pistol squat with extra depth and control.',
            
            deadBug: 'Core stability exercise with opposite arm and leg movements.',
            plank: 'Holding a push-up position on forearms to build core endurance.',
            kneeRaise: 'Lifting knees toward chest while hanging or supported.',
            mountainClimber: 'Dynamic plank with alternating knee drives to chest.',
            windshieldWiper: 'Rotating legs side to side while lying on back.',
            sidePlank: 'Lateral core exercise balancing on one forearm and foot edge.',
            legRaise: 'Lifting straight legs while hanging to target lower abs.',
            hollowHold: 'Holding body in a curved dish position for core compression.',
            lsit: 'Holding body supported with legs extended forward horizontally.',
            abWheel: 'Rolling device used for intense core stability training.',
            dragonFlag: 'Advanced core exercise keeping body rigid while pivoting from shoulders.',
            backLever: 'Horizontal hold facing down, suspended from a bar.',
            frontLever: 'Horizontal hold facing up, suspended from a bar.',
            vSit: 'Advanced L-sit with legs raised higher in a V shape.',
            manna: 'Elite gymnastic hold with legs extended forward beyond hands.',
            
            neckRotation: 'Gentle circular movements to release neck tension.',
            wristMob: 'Wrist movements in all directions for hand support preparation.',
            shoulderMob: 'Movements to improve shoulder joint range of motion.',
            thoracicRotation: 'Rotational movements targeting the middle back.',
            catCow: 'Alternating between arching and rounding the spine.',
            hipMob: 'Movements to improve hip joint mobility in all directions.',
            butterflyStretch: 'Seated stretch for inner thighs and hips.',
            spinalFlex: 'Various movements to improve spinal mobility.',
            ankleMob: 'Ankle movements to improve squatting and balance.',
            germanHang: 'Shoulder extension stretch used for advanced gymnastics preparation.',
            chestStretch: 'Stretches to open the chest and counteract pushing tightness.',
            pancake: 'Wide-legged forward fold for hip and hamstring flexibility.',
            frontSplit: 'Forward and backward leg split for hamstring and hip flexor flexibility.',
            middleSplit: 'Lateral leg split for adductor and hip flexibility.',
            bridgeStretch: 'Back bend with hands and feet on floor for spine and shoulder mobility.',
            
            ctw: 'Crow pose with feet touching wall for support while learning.',
            crow: 'Arm balance with knees resting on backs of arms.',
            lsit: 'Fundamental gymnastics position holding legs straight out in front.',
            frogstand: 'Basic hand balance with knees resting on elbows.',
            wallHandstand: 'Inverted position using wall for support.',
            handstand: 'Free-standing vertical balance on hands.',
            straddle: 'Planche variation with legs spread wide.',
            tuckedPlanche: 'Horizontal body hold with knees tucked to chest.',
            advTuckPlanche: 'Tuck planche with legs extended slightly forward.',
            humanFlag: 'Lateral body hold on a vertical pole.',
            backLever: 'Horizontal body position facing downward.',
            frontLever: 'Horizontal body position facing upward.',
            planche: 'Horizontal body hold supported only by straight arms.',
            icarusCross: 'Advanced gymnastic position combining cross and planche elements.',
            victorianCross: 'Extremely advanced hold with arms behind body in cross position.'
        };
        return descriptions[exerciseId] || 'This exercise focuses on building functional strength through proper form and progression.';
    };

    const getExerciseTips = (exerciseId) => {
        const tips = {
            inclinePushUp: ['Find stable elevated surface', 'Keep body straight', 'Lower chest to edge'],
            kneelingPushUp: ['Maintain straight line from knees to head', 'Keep core engaged', 'Full range of motion'],
            pushUp: ['Keep body in a straight line', 'Lower until chest nearly touches ground', 'Keep elbows at about 45°'],
            widePushUp: ['Hands wider than shoulders', 'Keep elbows tracking over wrists', 'Engage chest muscles'],
            declinePushUp: ['Elevate feet on stable surface', 'Keep core tight', 'Control the movement'],
            diamondPushUp: ['Form diamond with hands', 'Keep elbows close to body', 'Focus on triceps'],
            pseudoPlanche: ['Fingers point to feet', 'Lean forward', 'Keep shoulders depressed'],
            pikePushUp: ['Form an inverted V', 'Keep head between arms', 'Focus on shoulders'],
            wallHsPushUp: ['Maintain alignment', 'Control the descent', 'Push through full range'],
            archPushUp: ['Extend one arm out', 'Keep core stable', 'Alternate sides'],
            ringPushUp: ['Stabilize the rings', 'Keep wrists straight', 'Control the movement'],
            handstandPushUp: ['Maintain vertical alignment', 'Lower with control', 'Press strongly'],
            oneArmPushup: ['Widen feet for balance', 'Turn body slightly', 'Control the movement'],
            planchePushUp: ['Maintain body position', 'Protract shoulders', 'Press with control'],
            maltese: ['Build prerequisite strength', 'Use assistance if needed', 'Focus on shoulder depression'],
            
            scapulaPull: ['Engage shoulder blades', 'Pull down and together', 'Hold briefly at bottom'],
            activeHang: ['Shoulders away from ears', 'Create full-body tension', 'Practice controlled breathing'],
            negPullUp: ['Start at top position', 'Lower slowly (3-5 seconds)', 'Control the descent'],
            australianPull: ['Keep body straight', 'Pull chest to bar', 'Lower with control'],
            chinUp: ['Palms face toward you', 'Pull to chin over bar', 'Engage biceps and back'],
            pullUp: ['Palms face away', 'Pull chest to bar', 'Avoid swinging'],
            widePullUp: ['Wide grip', 'Focus on lats', 'Pull with controlled movement'],
            lSitPullUp: ['Keep legs at 90°', 'Maintain position throughout', 'Pull with power'],
            archPullUp: ['Extend one arm at top', 'Keep tension', 'Control movement speed'],
            typeWriter: ['Pull up then slide across', 'Maintain height', 'Keep shoulders engaged'],
            clappingPull: ['Pull explosively', 'Clap quickly', 'Catch safely'],
            muscleUp: ['Use false grip', 'Pull explosively', 'Transition smoothly'],
            oneArmPull: ['Minimal assistance', 'Keep body stable', 'Build with negatives first'],
            frontLeverPull: ['Maintain body position', 'Pull from lever to bar', 'Control the movement'],
            oneArmMuscleUp: ['Master one-arm pull first', 'Use false grip', 'Practice transition separately'],
            
            assistSquat: ['Use support only for balance', 'Weight in heels', 'Keep back neutral'],
            squat: ['Feet shoulder-width', 'Knees track over toes', 'Hips below parallel'],
            lunge: ['Step forward with control', 'Front knee over ankle', 'Drive through heel'],
            sideLunge: ['Step wide to side', 'Keep toes forward', 'Sit back and down'],
            calfRaise: ['Rise fully onto balls of feet', 'Lower heels below level', 'Keep legs straight'],
            bulgarianSquat: ['Elevate rear foot', 'Keep front foot flat', 'Upright torso'],
            jumpSquat: ['Land softly', 'Bend knees to absorb', 'Explode upward'],
            deepSquat: ['Keep heels down', 'Maintain neutral spine', 'Go below parallel'],
            walljumpSquat: ['Wide stance', 'Shift weight side to side', 'Keep chest up'],
            singleLegCalfRaise: ['Light support for balance', 'Full range of motion', 'Control the movement'],
            singleLegBridge: ['Shoulders on ground', 'Extend non-working leg', 'Squeeze glutes at top'],
            shrimpsquat: ['Hold rear foot', 'Control the descent', 'Keep chest up'],
            pistolSquat: ['Arms forward for balance', 'Keep heel down', 'Control the movement'],
            naturalLegExt: ['Kneel on soft surface', 'Maintain straight body', 'Use hands if needed'],
            deepPistolSquat: ['Full range of motion', 'Keep heel planted', 'Rise without momentum'],
            
            deadBug: ['Press lower back to floor', 'Extend opposite limbs', 'Breathe normally'],
            plank: ['Straight line head to heels', 'Shoulders over elbows', 'Engage core fully'],
            kneeRaise: ['Avoid swinging', 'Lift knees to chest', 'Lower with control'],
            mountainClimber: ['Keep hips level', 'Drive knees to chest', 'Maintain plank position'],
            windshieldWiper: ['Keep shoulders down', 'Control the movement', 'Engage obliques'],
            sidePlank: ['Stack feet or stagger', 'Keep body straight', 'Lift free arm for challenge'],
            legRaise: ['Keep legs straight', 'Avoid swinging', 'Control the lowering'],
            hollowHold: ['Lower back to floor', 'Adjust limb height for difficulty', 'Keep breathing'],
            lsit: ['Push shoulders down', 'Keep legs straight', 'Breathe despite compression'],
            abWheel: ['Start on knees', 'Slight arch in lower back', 'Roll out only as far as controllable'],
            dragonFlag: ['Support upper body', 'Keep body rigid', 'Lower with control'],
            backLever: ['Start with tuck position', 'Keep arms straight', 'Maintain body tension'],
            frontLever: ['Begin with tuck', 'Pull shoulder blades together', 'Straighten body gradually'],
            vSit: ['Press hands down', 'Lean back slightly', 'Lift legs higher than L-sit'],
            manna: ['Master L-sit first', 'Lean forward', 'Press strongly with straight arms'],
            
            neckRotation: ['Move slowly', 'Avoid pain', 'Breathe deeply'],
            wristMob: ['Move in all directions', 'Apply gentle pressure', 'Do before hand balancing'],
            shoulderMob: ['Include all movement planes', 'Start small, increase range', 'Regular practice'],
            thoracicRotation: ['Keep hips stable', 'Rotate from middle back', 'Use arm positions to enhance'],
            catCow: ['Follow your breath', 'Move segment by segment', 'Keep wrists aligned'],
            hipMob: ['Move in all directions', 'Find tight spots', 'Consistent practice'],
            butterflyStretch: ['Sit tall', 'Gentle knee pressure', 'Lean forward for intensity'],
            spinalFlex: ['Move with breath', 'Include all directions', 'Keep movements controlled'],
            ankleMob: ['Focus on dorsiflexion', 'Include rotations', 'Weight-bearing when ready'],
            germanHang: ['Support with feet', 'Open chest', 'Build time gradually'],
            chestStretch: ['Use doorway or wall', 'Keep shoulders down', 'Try different angles'],
            pancake: ['Sit with wide legs', 'Knees up', 'Fold from hips'],
            frontSplit: ['Square hips', 'Lower slowly', 'Back knee pointing down'],
            middleSplit: ['Toes up or slightly out', 'Support with hands', 'Keep pelvis neutral'],
            bridgeStretch: ['Push through arms', 'Feet hip-width', 'Work toward straight arms'],
            
            ctw: ['Hands shoulder-width', 'Knees on arms', 'Toes touch wall'],
            crow: ['Spread fingers wide', 'Look slightly forward', 'Engage core'],
            lsit: ['Push shoulders down', 'Straighten legs', 'Start on raised surface if needed'],
            frogstand: ['Bent elbows', 'Knees on upper arms', 'Look at floor ahead'],
            wallHandstand: ['Straight arms', 'Find balance point', 'Work on endurance'],
            handstand: ['Stack joints vertically', 'Engaged body', 'Small finger adjustments'],
            straddle: ['Lean forward', 'Wide legs', 'Protract shoulders'],
            tuckedPlanche: ['Lock elbows', 'Tight tuck', 'Strong shoulder protraction'],
            advTuckPlanche: ['Extend knees slightly', 'Maintain shoulder position', 'Hips at hand level'],
            humanFlag: ['Staggered grip', 'Push-pull opposition', 'Start with tuck'],
            backLever: ['Progressive tuck positions', 'Straight arms', 'Full body tension'],
            frontLever: ['Build with tuck first', 'Straight arms', 'Engaged lats'],
            planche: ['Progress systematically', 'Strong protraction', 'Hollow body position'],
            icarusCross: ['Master prerequisites', 'Specific conditioning', 'Assisted practice'],
            victorianCross: ['Extreme pressing strength', 'Specific training', 'Band assistance']
        };
        return tips[exerciseId] || ['Maintain proper form', 'Focus on controlled movement', 'Breathe steadily throughout'];
    };

    const resetAllExercises = () => {
        if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
            const freshExercises = initializeExerciseCategories();
            setExercises(freshExercises);
            setTotalProgress(0);
            localStorage.removeItem('rapidTreeProgress');
        }
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex justify-between items-center">
                <h1 className="title">RapidTree Progression</h1>
                <button 
                    onClick={resetAllExercises}
                    className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                    title="Reset all progress"
                >
                    <RefreshCw className="h-4 w-4" /> Reset All
                </button>
            </div>

            <div className="w-full rounded-lg bg-slate-100 p-4 shadow-sm">
                <div className="flex w-full flex-col items-center justify-center">
                    <div className="mb-2 flex justify-between w-full">
                        <span className="text-sm font-medium text-slate-700">Your Progress</span>
                        <span className="text-sm font-medium text-slate-700">{totalProgress}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div 
                            className="h-full rounded-full bg-[#1e628c] transition-all duration-500" 
                            style={{width: `${totalProgress}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:flex-nowrap">
                {Object.keys(exercises).map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                            "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            activeCategory === category 
                                ? "bg-[#1e628c] text-white" 
                                : "bg-white text-slate-800 hover:bg-slate-100"
                        )}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            <div className="relative min-h-[50vh] w-full overflow-x-auto">
                <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {exercises[activeCategory].map((exercise, index) => (
                        <div
                            key={exercise.id}
                            onClick={() => !exercise.isLocked && showExerciseDetails(activeCategory, exercise.id)}
                            className={cn(
                                "relative flex aspect-[1/1.15] cursor-pointer flex-col items-center justify-center rounded-lg p-2 text-center transition-all duration-200",
                                exercise.isCompleted ? "bg-[#27ae60] text-white" : 
                                exercise.isLocked ? "cursor-not-allowed bg-slate-300 text-slate-500" : "bg-[#1e628c] text-white",
                                "hover:shadow-lg",
                            )}
                        >
                            {exercise.isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
                                    <Lock className="h-6 w-6 text-white" />
                                </div>
                            )}
                            {exercise.isCompleted && (
                                <div className="absolute right-2 top-2">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                            )}
                            <div className="text-xl font-bold">{exercise.icon}</div>
                            <div className="mt-2 text-xs font-medium leading-tight sm:text-sm">{exercise.title}</div>
                            <div className="mt-1 text-xs opacity-80">{exercise.level}</div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedExercise && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex h-12 w-12 items-center justify-center rounded-lg text-white",
                                    selectedExercise.isCompleted ? "bg-[#27ae60]" : "bg-[#1e628c]"
                                )}>
                                    <span className="text-lg font-bold">{selectedExercise.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{selectedExercise.title}</h3>
                                    <div className="text-sm text-slate-500">{selectedExercise.level} Level</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedExercise(null)}
                                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-700">{getExerciseDescription(selectedExercise.id)}</p>

                            <div>
                                <h4 className="mb-2 font-semibold text-slate-900">Requirements:</h4>
                                <div className="mb-1 flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                                    <span className="text-slate-700">Sets</span>
                                    <span className="font-medium text-slate-900">3</span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                                    <span className="text-slate-700">Reps</span>
                                    <span className="font-medium text-slate-900">8-12</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 font-semibold text-slate-900">Tips:</h4>
                                <ul className="space-y-1 rounded-lg bg-slate-50 p-3">
                                    {getExerciseTips(selectedExercise.id).map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-700">
                                            <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1e628c]"></div>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                {selectedExercise.isCompleted ? (
                                    <button
                                        onClick={() => resetExercise(selectedExercise.category, selectedExercise.id)}
                                        className={cn(
                                            "flex-1 rounded-lg py-2 text-center font-medium",
                                            canResetExercise(selectedExercise.category, selectedExercise.id)
                                                ? "bg-red-500 hover:bg-red-600 text-white" 
                                                : "bg-red-300 text-white cursor-not-allowed"
                                        )}
                                        disabled={!canResetExercise(selectedExercise.category, selectedExercise.id)}
                                        title={!canResetExercise(selectedExercise.category, selectedExercise.id) 
                                            ? "Cannot reset - next exercise is still locked" 
                                            : ""}
                                    >
                                        Reset Progress
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => completeExercise(selectedExercise.category, selectedExercise.id)}
                                        className="flex-1 rounded-lg bg-[#1e628c] py-2 text-center font-medium text-white hover:bg-[#174e70]"
                                    >
                                        Mark as Complete
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedExercise(null)}
                                    className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="pb-6">
                <Footer />
            </div>
        </div>
    );
};

export default RapidTreePage;
