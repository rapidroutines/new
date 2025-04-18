import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import axios from "axios";

const SavedExercisesContext = createContext({});

export const SavedExercisesProvider = ({ children }) => {
  const [savedExercises, setSavedExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSavedExercises = async () => {
      if (!isAuthenticated) {
        setSavedExercises([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get("/api/user-data/get-data");
        setSavedExercises(response.data.savedExercises || []);
      } catch (error) {
        console.error("Error fetching saved exercises:", error);
        setSavedExercises([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedExercises();
  }, [isAuthenticated]);

  const addSavedExercise = async (exerciseData) => {
    if (!isAuthenticated) return false;

    try {
      const updatedExercises = [...savedExercises, exerciseData];
      
      await axios.post("/api/user-data/save-data", {
        dataType: "savedExercises",
        data: updatedExercises
      });

      setSavedExercises(updatedExercises);
      return true;
    } catch (error) {
      console.error("Error saving exercise:", error);
      return false;
    }
  };

  const removeSavedExercise = async (exerciseId) => {
    if (!isAuthenticated) return false;

    try {
      const updatedExercises = savedExercises.filter(ex => ex.id !== exerciseId);
      
      await axios.post("/api/user-data/save-data", {
        dataType: "savedExercises",
        data: updatedExercises
      });

      setSavedExercises(updatedExercises);
      return true;
    } catch (error) {
      console.error("Error removing saved exercise:", error);
      return false;
    }
  };

  const removeAllSavedExercises = async () => {
    if (!isAuthenticated) return false;

    try {
      await axios.post("/api/user-data/save-data", {
        dataType: "savedExercises",
        data: []
      });

      setSavedExercises([]);
      return true;
    } catch (error) {
      console.error("Error removing all saved exercises:", error);
      return false;
    }
  };

  const isSaved = (exerciseId) => {
    return savedExercises.some(ex => ex.id === exerciseId);
  };

  const value = {
    savedExercises,
    addSavedExercise,
    removeSavedExercise,
    removeAllSavedExercises,
    isSaved,
    isLoading
  };

  return <SavedExercisesContext.Provider value={value}>{children}</SavedExercisesContext.Provider>;
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

export default SavedExercisesContext;
