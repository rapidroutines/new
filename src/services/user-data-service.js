// src/services/user-data-service.js
import axios from "axios";

/**
 * Synchronize user data with the server
 * @param {string} dataType - Type of data to sync (savedExercises, exerciseLog, chatHistory)
 * @param {Array} data - Data to synchronize
 * @returns {Promise} Result object with success status and data or error
 */
export const syncUserData = async (dataType, data) => {
  try {
    // Check if we have a token before making the request
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No authentication token found, skipping sync");
      return { success: false, error: "No authentication token" };
    }
    
    // Ensure auth header is set
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    // Make the sync request
    const response = await axios.post("/api/user-data/save-data", {
      dataType,
      data,
    });
    
    console.log(`Synced ${dataType} successfully:`, response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error syncing ${dataType}:`, error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Fetch all user data from the server
 * @returns {Promise} Result object with success status and data or error
 */
export const fetchUserData = async () => {
  try {
    // Check if we have a token before making the request
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No authentication token found, skipping fetch");
      return { success: false, error: "No authentication token" };
    }
    
    // Ensure auth header is set
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    // Make the fetch request
    const response = await axios.get("/api/user-data/get-data");
    
    console.log("Fetched user data successfully");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user data:", error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};