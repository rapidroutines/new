import axios from "axios";

// Save data locally
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data || []));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Get data from localStorage
export const getFromLocalStorage = (key, defaultValue = []) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Synchronize user data with the server
 */
export const syncUserData = async (dataType, data) => {
  try {
    // 1. Always save to localStorage first (offline fallback)
    const localKey = `${dataType}_data`;
    saveToLocalStorage(localKey, data);
    
    // 2. Check if we have a token
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "No authentication token", localSaved: true };
    }
    
    // 3. Validate data
    if (!Array.isArray(data)) {
      return { success: false, error: "Invalid data format", localSaved: true };
    }
    
    // 4. Send to server
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    const response = await axios.post("/api/user-data/save-data", {
      dataType,
      data
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error syncing ${dataType}:`, error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message, 
      localSaved: true 
    };
  }
};

/**
 * Fetch all user data from the server
 */
export const fetchUserData = async () => {
  try {
    // 1. Check for token
    const token = localStorage.getItem("token");
    if (!token) {
      const localData = {
        savedExercises: getFromLocalStorage("savedExercises_data"),
        exerciseLog: getFromLocalStorage("exercises_data"),
        chatHistory: getFromLocalStorage("chatbot_history_data")
      };
      
      return { success: true, data: localData, source: "localStorage" };
    }
    
    // 2. Get data from server
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    const response = await axios.get("/api/user-data/get-data");
    
    // 3. Update localStorage as backup
    if (response.data.savedExercises) {
      saveToLocalStorage("savedExercises_data", response.data.savedExercises);
    }
    if (response.data.exerciseLog) {
      saveToLocalStorage("exercises_data", response.data.exerciseLog);
    }
    if (response.data.chatHistory) {
      saveToLocalStorage("chatbot_history_data", response.data.chatHistory);
    }
    
    return { success: true, data: response.data, source: "server" };
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    
    // Fallback to local data
    const localData = {
      savedExercises: getFromLocalStorage("savedExercises_data"),
      exerciseLog: getFromLocalStorage("exercises_data"),
      chatHistory: getFromLocalStorage("chatbot_history_data")
    };
    
    return { success: false, error: error.message, data: localData, source: "localStorage" };
  }
};

/**
 * Sync data deletions with the server - this ensures deletions propagate across devices
 */
export const syncUserDataDeletion = async (dataType, updatedData) => {
  // We use the same syncUserData function but make it clear this is for deletion sync
  return syncUserData(dataType, updatedData);
};
