import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import { syncUserData, syncUserDataDeletion, fetchUserData, getFromLocalStorage } from "../services/user-data-service";

// Create context
const ChatbotContext = createContext({});

// Provider component
export const ChatbotProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        
        // 1. First try from localStorage for immediate display
        const localHistory = getFromLocalStorage("chatbot_history_data", []);
        if (localHistory.length > 0) {
          setChatHistory(localHistory);
        }
        
        // 2. If authenticated, try to get from server
        if (isAuthenticated) {
          const result = await fetchUserData();
          
          if (result.success && result.data?.chatHistory?.length > 0) {
            setChatHistory(result.data.chatHistory);
          } else if (localHistory.length > 0) {
            // 3. If server has no data but we have local data, sync to server
            await syncUserData("chatHistory", localHistory);
          }
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [isAuthenticated]);

  // Sync when chat history changes
  useEffect(() => {
    const syncHistory = async () => {
      if (isAuthenticated && chatHistory.length > 0) {
        await syncUserData("chatHistory", chatHistory);
      }
    };
    
    // Skip initial sync
    if (!isLoading) {
      syncHistory();
    }
  }, [chatHistory, isAuthenticated, isLoading]);

  // Generate a summary based on conversation
  const generateSummary = (messages) => {
    if (!messages || messages.length === 0) {
      return { title: "New chat", messageCount: 0, userMsgCount: 0, botMsgCount: 0 };
    }
    
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
    if (!sessionData?.messages?.length) {
      return false;
    }
    
    const newSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      messages: sessionData.messages,
      summary: generateSummary(sessionData.messages)
    };
    
    setChatHistory(prev => [newSession, ...prev]);
    return true;
  };

  // Delete a specific chat session
  const deleteChatSession = (sessionId) => {
    if (!sessionId) return false;
    
    // Filter out the deleted session
    const updatedHistory = chatHistory.filter(session => session.id !== sessionId);
    
    // Update local state
    setChatHistory(updatedHistory);
    
    // Sync with server if authenticated - use the deletion sync function
    if (isAuthenticated) {
      syncUserDataDeletion("chatHistory", updatedHistory)
        .catch(err => console.error("Error syncing chat deletion:", err));
    }
    
    return true;
  };

  // Delete all chat sessions
  const deleteAllChatSessions = () => {
    // Clear local state
    setChatHistory([]);
    
    // Sync empty array with server if authenticated
    if (isAuthenticated) {
      syncUserDataDeletion("chatHistory", [])
        .catch(err => console.error("Error syncing all chats deletion:", err));
    }
    
    return true;
  };

  // Get chat history with optional filtering
  const getChatHistory = (count = null) => {
    if (!chatHistory?.length) return [];
    return count ? chatHistory.slice(0, count) : chatHistory;
  };

  // Manual sync function
  const syncChatHistoryWithCloud = async () => {
    if (!isAuthenticated) return false;
    
    try {
      setIsLoading(true);
      const result = await syncUserData("chatHistory", chatHistory);
      return result.success;
    } catch (error) {
      console.error("Error syncing chat history:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    chatHistory,
    addChatSession,
    getChatHistory,
    deleteChatSession,
    deleteAllChatSessions,
    isLoading,
    syncChatHistoryWithCloud
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
};

ChatbotProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  
  return context;
};

export default ChatbotContext;
