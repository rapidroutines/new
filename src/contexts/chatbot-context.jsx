import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import { syncUserData, fetchUserData } from "../services/user-data-service";

// Create chatbot history context
const ChatbotContext = createContext({
  chatHistory: [],
  addChatSession: () => {},
  getChatHistory: () => [],
  deleteChatSession: () => false,
  deleteAllChatSessions: () => false,
  isLoading: false,
  syncChatHistoryWithCloud: () => {},
});

export const ChatbotProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load chat history from cloud or localStorage on initial render
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);

        if (isAuthenticated) {
          // Try to fetch from cloud first
          const result = await fetchUserData();
          if (result.success && result.data.chatHistory && result.data.chatHistory.length > 0) {
            setChatHistory(result.data.chatHistory);
            console.log("Loaded chat history from cloud:", result.data.chatHistory.length);
            // Also update localStorage as backup
            localStorage.setItem("chatbot_history_data", JSON.stringify(result.data.chatHistory));
            setIsLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        const storedHistory = localStorage.getItem("chatbot_history_data");
        
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          setChatHistory(parsedHistory);
          console.log("Loaded chat history from local storage:", parsedHistory.length);
          
          // If authenticated but cloud data was empty, sync localStorage data to cloud
          if (isAuthenticated && parsedHistory.length > 0) {
            syncUserData("chatHistory", parsedHistory);
          }
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [isAuthenticated]);

  // Sync chat history to cloud when authenticated and history changes
  useEffect(() => {
    const syncToCloud = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          await syncUserData("chatHistory", chatHistory);
          console.log("Synced chat history to cloud:", chatHistory.length);
        } catch (error) {
          console.error("Error syncing chat history to cloud:", error);
        }
      }
    };

    // Only sync if not in initial loading state
    if (!isLoading) {
      syncToCloud();
    }
  }, [chatHistory, isAuthenticated, isLoading]);

  // Generate a summary based on conversation
  const generateSummary = (messages) => {
    // Simple summary generator - uses first user message for title
    // and counts messages to determine length
    if (!messages || messages.length === 0) return {};
    
    // Find first user message for title
    const firstUserMessage = messages.find(m => m.role === "user")?.content || "Chat session";
    
    // Create a title from first user message (limited to 40 chars)
    let title = firstUserMessage.length > 40 
        ? firstUserMessage.substring(0, 40) + "..." 
        : firstUserMessage;
        
    // Count messages
    const userMsgCount = messages.filter(m => m.role === "user").length;
    const botMsgCount = messages.filter(m => m.role === "assistant").length;
    
    return {
        title,
        messageCount: messages.length,
        userMsgCount,
        botMsgCount
    };
  };

  // Add a new chat session
  const addChatSession = (sessionData) => {
    const newSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      messages: sessionData.messages || [],
      summary: generateSummary(sessionData.messages)
    };

    console.log("Adding new chat session:", newSession);
    
    setChatHistory(prevHistory => {
      const updatedHistory = [newSession, ...prevHistory];
      
      // Update localStorage
      try {
        localStorage.setItem("chatbot_history_data", JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Error saving chat history to localStorage:", error);
      }
      
      return updatedHistory;
    });
    
    return true;
  };

  // Delete a specific chat session
  const deleteChatSession = (sessionId) => {
    setChatHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(session => session.id !== sessionId);
      
      // Update localStorage
      try {
        localStorage.setItem("chatbot_history_data", JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Error saving updated chat history to localStorage:", error);
      }
      
      return updatedHistory;
    });
    
    return true;
  };

  // Delete all chat sessions
  const deleteAllChatSessions = () => {
    setChatHistory([]);
    
    // Clear in localStorage
    try {
      localStorage.setItem("chatbot_history_data", JSON.stringify([]));
    } catch (error) {
      console.error("Error clearing chat history in localStorage:", error);
    }
    
    return true;
  };

  // Get chat history with optional filtering
  const getChatHistory = (count = null) => {
    if (!chatHistory || chatHistory.length === 0) return [];
    
    // Return limited number if count is specified
    return count ? chatHistory.slice(0, count) : chatHistory;
  };

  // Manual sync function for explicit calls
  const syncChatHistoryWithCloud = async () => {
    if (!isAuthenticated) return false;

    try {
      const result = await syncUserData("chatHistory", chatHistory);
      return result.success;
    } catch (error) {
      console.error("Error in manual sync of chat history:", error);
      return false;
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        chatHistory,
        addChatSession,
        getChatHistory,
        deleteChatSession,
        deleteAllChatSessions,
        isLoading,
        syncChatHistoryWithCloud
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

ChatbotProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  
  return context;
};