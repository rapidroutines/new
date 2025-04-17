// src/contexts/exercise-context.jsx
import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import { syncUserData, syncUserDataDeletion, fetchUserData, getFromLocalStorage } from "../services/user-data-service";

// Create context
const ExerciseContext = createContext({});

// Provider component
export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load exercises on mount
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setIsLoading(true);
        
        // 1. First try from localStorage for immediate display
        const localExercises = getFromLocalStorage("exercises_data", []);
        if (localExercises.length > 0) {
          setExercises(localExercises);
        }
        
        // 2. If authenticated, try to get from server
        if (isAuthenticated) {
          const result = await fetchUserData();
          
          if (result.success && result.data?.exerciseLog?.length > 0) {
            setExercises(result.data.exerciseLog);
          } else if (localExercises.length > 0) {
            // 3. If server has no data but we have local data, sync to server
            await syncUserData("exerciseLog", localExercises);
          }
        }
      } catch (error) {
        console.error("Error loading exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [isAuthenticated]);

  // Sync when exercises change
  useEffect(() => {
    const syncExercises = async () => {
      if (isAuthenticated && exercises.length > 0) {
        await syncUserData("exerciseLog", exercises);
      }
    };
    
    // Skip initial sync
    if (!isLoading) {
      syncExercises();
    }
  }, [exercises, isAuthenticated, isLoading]);

  // Add a new exercise
  const addExercise = (exerciseData) => {
    if (!exerciseData) return false;
    
    const newExercise = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...exerciseData
    };
    
    setExercises(prev => [...prev, newExercise]);
    return true;
  };

  // Delete a specific exercise
  const deleteExercise = (exerciseId) => {
    if (!exerciseId) return false;
    
    // Filter out the deleted exercise
    const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
    
    // Update local state
    setExercises(updatedExercises);
    
    // Sync with server if authenticated - use the deletion sync function
    if (isAuthenticated) {
      syncUserDataDeletion("exerciseLog", updatedExercises)
        .catch(err => console.error("Error syncing exercise deletion:", err));
    }
    
    return true;
  };

  // Delete all exercises
  const deleteAllExercises = () => {
    // Clear local state
    setExercises([]);
    
    // Sync empty array with server if authenticated
    if (isAuthenticated) {
      syncUserDataDeletion("exerciseLog", [])
        .catch(err => console.error("Error syncing all exercises deletion:", err));
    }
    
    return true;
  };

  // Get exercises with optional filtering
  const getExercises = (count = null) => {
    if (!exercises?.length) return [];
    
    // Sort by timestamp (newest first)
    const sortedExercises = [...exercises].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return count ? sortedExercises.slice(0, count) : sortedExercises;
  };

  // Manual sync function
  const syncExercisesWithCloud = async () => {
    if (!isAuthenticated) return false;
    
    try {
      setIsLoading(true);
      const result = await syncUserData("exerciseLog", exercises);
      return result.success;
    } catch (error) {
      console.error("Error syncing exercises:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    exercises,
    addExercise,
    getExercises,
    deleteExercise,
    deleteAllExercises,
    isLoading,
    syncExercisesWithCloud
  };

  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
};

ExerciseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook
export const useExercises = () => {
  const context = useContext(ExerciseContext);
  
  if (context === undefined) {
    throw new Error("useExercises must be used within an ExerciseProvider");
  }
  
  return context;
};

export default ExerciseContext;
