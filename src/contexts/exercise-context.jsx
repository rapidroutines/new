import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import { syncUserData, fetchUserData } from "../services/user-data-service";

// Create exercise tracking context
const ExerciseContext = createContext({
  exercises: [],
  addExercise: () => {},
  getExercises: () => [],
  deleteExercise: () => false,
  deleteAllExercises: () => false,
  isLoading: false,
  syncExercisesWithCloud: () => {},
});

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load exercises from cloud or localStorage on initial render
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setIsLoading(true);
        
        if (isAuthenticated) {
          // Try to fetch from cloud first
          const result = await fetchUserData();
          if (result.success && result.data.exerciseLog && result.data.exerciseLog.length > 0) {
            setExercises(result.data.exerciseLog);
            console.log("Loaded exercises from cloud:", result.data.exerciseLog.length);
            // Also update localStorage as backup
            localStorage.setItem("exercises_data", JSON.stringify(result.data.exerciseLog));
            setIsLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        const storedExercises = localStorage.getItem("exercises_data");
        
        if (storedExercises) {
          const parsedExercises = JSON.parse(storedExercises);
          setExercises(parsedExercises);
          console.log("Loaded exercises from storage:", parsedExercises.length);
          
          // If authenticated but cloud data was empty, sync localStorage data to cloud
          if (isAuthenticated && parsedExercises.length > 0) {
            syncUserData("exerciseLog", parsedExercises);
          }
        } else {
          console.log("No stored exercises found");
          setExercises([]);
        }
      } catch (error) {
        console.error("Error loading exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [isAuthenticated]);

  // Sync exercises to cloud when authenticated and exercises change
  useEffect(() => {
    const syncToCloud = async () => {
      if (isAuthenticated && exercises.length > 0 && !isLoading) {
        try {
          await syncUserData("exerciseLog", exercises);
          console.log("Synced exercises to cloud:", exercises.length);
        } catch (error) {
          console.error("Error syncing exercises to cloud:", error);
        }
      }
    };

    // Only run after initial loading is complete
    if (!isLoading) {
      syncToCloud();
    }
  }, [exercises, isAuthenticated, isLoading]);

  // Add a new exercise record
  const addExercise = (exerciseData) => {
    const newExercise = {
      id: Date.now().toString(), // Use string IDs for consistent format
      timestamp: new Date().toISOString(),
      ...exerciseData
    };

    console.log("Adding new exercise:", newExercise);
    
    setExercises(prevExercises => {
      const updatedExercises = [...prevExercises, newExercise];
      
      // Also update in localStorage immediately for redundancy
      try {
        localStorage.setItem("exercises_data", JSON.stringify(updatedExercises));
        console.log("Updated exercises in storage:", updatedExercises.length);
      } catch (error) {
        console.error("Error immediately saving exercise to storage:", error);
      }
      
      return updatedExercises;
    });
    
    return true;
  };

  // Delete a specific exercise
  const deleteExercise = (exerciseId) => {
    setExercises(prevExercises => {
      const updatedExercises = prevExercises.filter(ex => ex.id !== exerciseId);
      
      // Update localStorage
      try {
        localStorage.setItem("exercises_data", JSON.stringify(updatedExercises));
      } catch (error) {
        console.error("Error saving updated exercises to storage:", error);
      }
      
      return updatedExercises;
    });
    
    return true;
  };

  // Delete all exercises
  const deleteAllExercises = () => {
    setExercises([]);
    
    // Clear in localStorage
    try {
      localStorage.setItem("exercises_data", JSON.stringify([]));
    } catch (error) {
      console.error("Error clearing exercises in storage:", error);
    }
    
    return true;
  };

  // Get exercises with optional filtering
  const getExercises = (count = null) => {
    if (!exercises || exercises.length === 0) return [];
    
    // Sort by timestamp (newest first)
    const sortedExercises = [...exercises].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Return limited number if count is specified
    return count ? sortedExercises.slice(0, count) : sortedExercises;
  };

  // Manual sync function for explicit calls
  const syncExercisesWithCloud = async () => {
    if (!isAuthenticated || exercises.length === 0) return false;

    try {
      const result = await syncUserData("exerciseLog", exercises);
      return result.success;
    } catch (error) {
      console.error("Error in manual sync of exercises:", error);
      return false;
    }
  };

  return (
    <ExerciseContext.Provider
      value={{
        exercises,
        addExercise,
        getExercises,
        deleteExercise,
        deleteAllExercises,
        isLoading,
        syncExercisesWithCloud
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

ExerciseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useExercises = () => {
  const context = useContext(ExerciseContext);
  
  if (context === undefined) {
    throw new Error("useExercises must be used within an ExerciseProvider");
  }
  
  return context;
};