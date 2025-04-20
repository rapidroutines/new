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
        setTreeProgress({});
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get("/api/user-data/get-data");
        const userData = response.data;
        
        if (userData.rapidTreeProgress) {
          setTreeProgress(userData.rapidTreeProgress);
        } else {
          setTreeProgress({});
        }
      } catch (error) {
        console.error("Error fetching RapidTree progress:", error);
        setTreeProgress({});
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
    if (isAuthenticated) {
      setTreeProgress(newProgress);
      return await saveProgressToServer(newProgress);
    } else {
      setTreeProgress(newProgress);
    }
    
    return true;
  };

  const resetTreeProgress = async () => {
    const emptyProgress = {};
    setTreeProgress(emptyProgress);
    
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
