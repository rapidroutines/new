import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import { syncUserData, fetchUserData } from "../services/user-data-service";

// Create saved exercises context
const SavedExercisesContext = createContext({
  savedExercises: [],
  addSavedExercise: () => {},
  removeSavedExercise: () => {},
  isSaved: () => false,
  isLoading: false,
  syncSavedExercisesWithCloud: () => {},
});

export const SavedExercisesProvider = ({ children }) => {
  const [savedExercises, setSavedExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load saved exercises from localStorage or cloud on initial render
  useEffect(() => {
    const loadSavedExercises = async () => {
      try {
        setIsLoading(true);

        if (isAuthenticated) {
          // Try to fetch from cloud first
          const result = await fetchUserData();
          if (result.success && result.data.savedExercises && result.data.savedExercises.length > 0) {
            setSavedExercises(result.data.savedExercises);
            console.log("Loaded saved exercises from cloud:", result.data.savedExercises.length);
            // Also update localStorage as backup
            localStorage.setItem("savedExercises_data", JSON.stringify(result.data.savedExercises));
            setIsLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        const storedExercises = localStorage.getItem("savedExercises_data");
        
        if (storedExercises) {
          const parsedExercises = JSON.parse(storedExercises);
          setSavedExercises(parsedExercises);
          console.log("Loaded saved exercises from local storage:", parsedExercises.length);
          
          // If authenticated but cloud data was empty, sync localStorage data to cloud
          if (isAuthenticated && parsedExercises.length > 0) {
            syncUserData("savedExercises", parsedExercises);
          }
        } else {
          setSavedExercises([]);
        }
      } catch (error) {
        console.error("Error loading saved exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedExercises();
  }, [isAuthenticated]);

  // Sync saved exercises to cloud when authenticated and exercises change
  useEffect(() => {
    const syncToCloud = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          await syncUserData("savedExercises", savedExercises);
          console.log("Synced saved exercises to cloud:", savedExercises.length);
        } catch (error) {
          console.error("Error syncing saved exercises to cloud:", error);
        }
      }
    };

    // Only sync if not in initial loading state
    if (!isLoading) {
      syncToCloud();
    }
  }, [savedExercises, isAuthenticated, isLoading]);

  // Add a new saved exercise
  const addSavedExercise = (exerciseData) => {
    if (!exerciseData.id) {
      console.error("Exercise data missing ID");
      return false;
    }

    // Check if already saved
    if (savedExercises.some(ex => ex.id === exerciseData.id)) {
      console.log("Exercise already saved");
      return false;
    }

    console.log("Adding saved exercise:", exerciseData);
    
    setSavedExercises(prevExercises => {
      const updatedExercises = [...prevExercises, exerciseData];
      
      // Also update in localStorage immediately
      try {
        localStorage.setItem("savedExercises_data", JSON.stringify(updatedExercises));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      
      return updatedExercises;
    });
    
    return true;
  };

  // Remove a saved exercise
  const removeSavedExercise = (exerciseId) => {
    setSavedExercises(prevExercises => {
      const updatedExercises = prevExercises.filter(ex => ex.id !== exerciseId);
      
      // Update in localStorage
      try {
        localStorage.setItem("savedExercises_data", JSON.stringify(updatedExercises));
      } catch (error) {
        console.error("Error updating localStorage:", error);
      }
      
      return updatedExercises;
    });
    
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
      const result = await syncUserData("savedExercises", savedExercises);
      return result.success;
    } catch (error) {
      console.error("Error in manual sync:", error);
      return false;
    }
  };

  return (
    <SavedExercisesContext.Provider
      value={{
        savedExercises,
        addSavedExercise,
        removeSavedExercise,
        isSaved,
        isLoading,
        syncSavedExercisesWithCloud
      }}
    >
      {children}
    </SavedExercisesContext.Provider>
  );
};

SavedExercisesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSavedExercises = () => {
  const context = useContext(SavedExercisesContext);
  
  if (context === undefined) {
    throw new Error("useSavedExercises must be used within a SavedExercisesProvider");
  }
  
  return context;
};