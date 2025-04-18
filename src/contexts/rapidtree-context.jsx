import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import axios from "axios";

const RapidTreeContext = createContext({});

export const RapidTreeProvider = ({ children }) => {
  const [treeProgress, setTreeProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTreeProgress = async () => {
      if (!isAuthenticated) {
        // If not authenticated, load from localStorage as fallback
        const savedProgress = localStorage.getItem('rapidTreeProgress');
        if (savedProgress) {
          try {
            setTreeProgress(JSON.parse(savedProgress));
          } catch (error) {
            console.error('Error parsing saved progress from localStorage:', error);
            setTreeProgress({});
          }
        } else {
          setTreeProgress({});
        }
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get("/api/user-data/get-data");
        const userData = response.data;
        
        // Check if rapidTreeProgress exists in user data
        if (userData.rapidTreeProgress) {
          setTreeProgress(userData.rapidTreeProgress);
        } else {
          // If not, initialize from localStorage if available
          const savedProgress = localStorage.getItem('rapidTreeProgress');
          if (savedProgress) {
            try {
              const parsedProgress = JSON.parse(savedProgress);
              setTreeProgress(parsedProgress);
              
              // Save the localStorage data to the server
              await saveProgressToServer(parsedProgress);
            } catch (error) {
              console.error('Error parsing saved progress:', error);
              setTreeProgress({});
            }
          } else {
            setTreeProgress({});
          }
        }
      } catch (error) {
        console.error("Error fetching RapidTree progress:", error);
        
        // Fallback to localStorage
        const savedProgress = localStorage.getItem('rapidTreeProgress');
        if (savedProgress) {
          try {
            setTreeProgress(JSON.parse(savedProgress));
          } catch (error) {
            console.error('Error parsing saved progress from localStorage:', error);
            setTreeProgress({});
          }
        } else {
          setTreeProgress({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreeProgress();
  }, [isAuthenticated]);

  const saveProgressToServer = async (progressData) => {
    if (!isAuthenticated) return false;

    try {
      await axios.post("/api/user-data/save-data", {
        dataType: "rapidTreeProgress",
        data: progressData
      });
      return true;
    } catch (error) {
      console.error("Error saving RapidTree progress to server:", error);
      return false;
    }
  };

  const updateTreeProgress = async (newProgress) => {
    setTreeProgress(newProgress);
    
    // Save to localStorage as backup
    localStorage.setItem('rapidTreeProgress', JSON.stringify(newProgress));
    
    // If authenticated, save to server
    if (isAuthenticated) {
      return await saveProgressToServer(newProgress);
    }
    
    return true;
  };

  const resetTreeProgress = async () => {
    const emptyProgress = {};
    setTreeProgress(emptyProgress);
    
    // Clear from localStorage
    localStorage.removeItem('rapidTreeProgress');
    
    // If authenticated, save empty progress to server
    if (isAuthenticated) {
      return await saveProgressToServer(emptyProgress);
    }
    
    return true;
  };

  const value = {
    treeProgress,
    updateTreeProgress,
    resetTreeProgress,
    isLoading
  };

  return <RapidTreeContext.Provider value={value}>{children}</RapidTreeContext.Provider>;
};

RapidTreeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useRapidTree = () => {
  const context = useContext(RapidTreeContext);
  
  if (context === undefined) {
    throw new Error("useRapidTree must be used within a RapidTreeProvider");
  }
  
  return context;
};

export default RapidTreeContext;
