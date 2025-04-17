import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import { syncUserData, syncUserDataDeletion, fetchUserData, getFromLocalStorage } from "../services/user-data-service";

// Create context
const SavedExercisesContext = createContext({});

// Provider component
export const SavedExercisesProvider = ({ children }) => {
  const [savedExercises, setSavedExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load saved exercises on mount
  useEffect(() => {
    const loadSavedExercises = async () => {
      try {
        setIsLoading(true);
        
        // 1. First try from localStorage for immediate display
        const localExercises = getFromLocalStorage("savedExercises_data", []);
        if (localExercises.length > 0) {
          setSavedExercises(localExercises);
        }
        
        // 2. If authenticated, try to get from server
        if (isAuthenticated) {
          const result = await fetchUserData();
          
          if (result.success && result.data?.savedExercises?.length > 0) {
            setSavedExercises(result.data.savedExercises);
          } else if (localExercises.length > 0) {
            // 3. If server has no data but we have local data, sync to server
            await syncUserData("savedExercises", localExercises);
          }
        }
      } catch (error) {
        console.error("Error loading saved exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedExercises();
  }, [isAuthenticated]);

  // Sync when saved exercises change
  useEffect(() => {
    const syncExercises = async () => {
      if (isAuthenticated && savedExercises.length > 0) {
        await syncUserData("savedExercises", savedExercises);
      }
    };
    
    // Skip initial sync
    if (!isLoading) {
      syncExercises();
    }
  }, [savedExercises, isAuthenticated, isLoading]);

  // Add a saved exercise
  const addSavedExercise = (exerciseData) => {
    if (!exerciseData?.id) {
      console.error("Invalid exercise data");
      return false;
    }
    
    // Check if already saved
    if (savedExercises.some(ex => ex.id === exerciseData.id)) {
      console.log("Exercise already saved");
      return false;
    }
    
    setSavedExercises(prev => [...prev, exerciseData]);
    return true;
  };

  // Remove a saved exercise
  const removeSavedExercise = (exerciseId) => {
    if (!exerciseId) return false;
    
    // Filter out the removed exercise
    const updatedExercises = savedExercises.filter(ex => ex.id !== exerciseId);
    
    // Update local state
    setSavedExercises(updatedExercises);
    
    // Sync with server if authenticated - use the deletion sync function
    if (isAuthenticated) {
      syncUserDataDeletion("savedExercises", updatedExercises)
        .catch(err => console.error("Error syncing saved exercise deletion:", err));
    }
    
    return true;
  };

  // Remove all saved exercises
  const removeAllSavedExercises = () => {
    // Clear local state
    setSavedExercises([]);
    
    // Sync empty array with server if authenticated
    if (isAuthenticated) {
      syncUserDataDeletion("savedExercises", [])
        .catch(err => console.error("Error syncing all saved exercises deletion:", err));
    }
    
    return true;
  };

  // Check if an exercise is saved
  const isSaved = (exerciseId) => {
    return savedExercises.some(ex => ex.id === exerciseId);
  };

  // Manual sync function
  const syncSavedExercisesWithCloud = async () => {
    if (!isAuthenticated) return false;
    
    try {
      setIsLoading(true);
      const result = await syncUserData("savedExercises", savedExercises);
      return result.success;
    } catch (error) {
      console.error("Error syncing saved exercises:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    savedExercises,
    addSavedExercise,
    removeSavedExercise,
    removeAllSavedExercises,
    isSaved,
    isLoading,
    syncSavedExercisesWithCloud
  };

  return <SavedExercisesContext.Provider value={value}>{children}</SavedExercisesContext.Provider>;
};

SavedExercisesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook
export const useSavedExercises = () => {
  const context = useContext(SavedExercisesContext);
  
  if (context === undefined) {
    throw new Error("useSavedExercises must be used within a SavedExercisesProvider");
  }
  
  return context;
};

export default SavedExercisesContext;
