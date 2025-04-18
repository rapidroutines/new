// src/contexts/exercise-context.jsx
import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import axios from "axios";

const ExerciseContext = createContext({});

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load exercises from server when component mounts
  useEffect(() => {
    const fetchExercises = async () => {
      if (!isAuthenticated) {
        setExercises([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get("/api/user-data/get-data");
        setExercises(response.data.exerciseLog || []);
      } catch (error) {
        console.error("Error fetching exercise log:", error);
        setExercises([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [isAuthenticated]);

  // Add a new exercise
  const addExercise = async (exerciseData) => {
    // Create a unique ID for this exercise
    const newExercise = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...exerciseData
    };
    
    if (isAuthenticated) {
      try {
        // Add the new exercise to the existing list
        const updatedExercises = [...exercises, newExercise];
        
        // Save to server
        await axios.post("/api/user-data/save-data", {
          dataType: "exerciseLog",
          data: updatedExercises
        });

        // Update local state
        setExercises(updatedExercises);
        return true;
      } catch (error) {
        console.error("Error saving exercise:", error);
        return false;
      }
    } else {
      // If not authenticated, we don't save the data
      console.log("Exercise not saved: User not authenticated");
      return false;
    }
  };

  // Delete a single exercise by ID
  const deleteExercise = async (exerciseId) => {
    if (!isAuthenticated) return false;

    try {
      const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
      
      await axios.post("/api/user-data/save-data", {
        dataType: "exerciseLog",
        data: updatedExercises
      });

      setExercises(updatedExercises);
      return true;
    } catch (error) {
      console.error("Error deleting exercise:", error);
      return false;
    }
  };

  // Delete multiple exercises by IDs (for deleting entire exercise groups)
  const deleteExercisesByIds = async (exerciseIds) => {
    if (!isAuthenticated || !exerciseIds || exerciseIds.length === 0) return false;

    try {
      const updatedExercises = exercises.filter(ex => !exerciseIds.includes(ex.id));
      
      await axios.post("/api/user-data/save-data", {
        dataType: "exerciseLog",
        data: updatedExercises
      });

      setExercises(updatedExercises);
      return true;
    } catch (error) {
      console.error("Error deleting exercises:", error);
      return false;
    }
  };

  // Delete all exercises
  const deleteAllExercises = async () => {
    if (!isAuthenticated) return false;

    try {
      await axios.post("/api/user-data/save-data", {
        dataType: "exerciseLog",
        data: []
      });

      setExercises([]);
      return true;
    } catch (error) {
      console.error("Error deleting all exercises:", error);
      return false;
    }
  };

  // Get exercises (sorted by timestamp, with optional limit)
  const getExercises = (count = null) => {
    const sortedExercises = [...exercises].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return count ? sortedExercises.slice(0, count) : sortedExercises;
  };

  // For the iframe to use this context
  const syncExercisesWithIframe = async (iframeRef) => {
    if (!iframeRef || !iframeRef.current) return false;
    
    // Send user token to iframe if authenticated
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        iframeRef.current.contentWindow.postMessage({
          type: 'loadUserData',
          token: token
        }, '*');
        return true;
      }
    } else {
      // Clear iframe data if not authenticated
      iframeRef.current.contentWindow.postMessage({
        type: 'clearUserData'
      }, '*');
    }
    return false;
  };

  const value = {
    exercises,
    addExercise,
    getExercises,
    deleteExercise,
    deleteExercisesByIds,
    deleteAllExercises,
    syncExercisesWithIframe,
    isLoading
  };

  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
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

export default ExerciseContext;