import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import axios from "axios";

const ExerciseContext = createContext({});

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

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

  const addExercise = async (exerciseData) => {
    if (!isAuthenticated) return false;

    try {
      const newExercise = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...exerciseData
      };
      
      const updatedExercises = [...exercises, newExercise];
      
      await axios.post("/api/user-data/save-data", {
        dataType: "exerciseLog",
        data: updatedExercises
      });

      setExercises(updatedExercises);
      return true;
    } catch (error) {
      console.error("Error saving exercise:", error);
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

  const getExercises = (count = null) => {
    const sortedExercises = [...exercises].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return count ? sortedExercises.slice(0, count) : sortedExercises;
  };

  const value = {
    exercises,
    addExercise,
    getExercises,
    deleteExercise,
    deleteExercisesByIds,
    deleteAllExercises,
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
