import axios from "axios";

export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { 
        success: false, 
        error: "No authentication token", 
        data: { 
          savedExercises: [], 
          exerciseLog: [], 
          chatHistory: [] 
        } 
      };
    }
    
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    const response = await axios.get("/api/user-data/get-data");
    
    return { 
      success: true, 
      data: {
        savedExercises: response.data.savedExercises || [],
        exerciseLog: response.data.exerciseLog || [],
        chatHistory: response.data.chatHistory || []
      },
      source: "server" 
    };
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    
    return { 
      success: false, 
      error: error.message, 
      data: { 
        savedExercises: [], 
        exerciseLog: [], 
        chatHistory: [] 
      },
      source: "error" 
    };
  }
};
