import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";
import axios from "axios";

const ChatbotContext = createContext({});

export const ChatbotProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!isAuthenticated) {
        setChatHistory([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get("/api/user-data/get-data");
        setChatHistory(response.data.chatHistory || []);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setChatHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [isAuthenticated]);

  const generateSummary = (messages) => {
    if (!messages || messages.length === 0) {
      return { 
        title: "New chat", 
        messageCount: 0, 
        userMsgCount: 0, 
        botMsgCount: 0 
      };
    }
    
    const firstUserMessage = messages.find(m => m.role === "user")?.content || "Chat session";
    
    let title = firstUserMessage.length > 40 
        ? firstUserMessage.substring(0, 40) + "..." 
        : firstUserMessage;
        
    const userMsgCount = messages.filter(m => m.role === "user").length;
    const botMsgCount = messages.filter(m => m.role === "assistant").length;
    
    return {
      title,
      messageCount: messages.length,
      userMsgCount,
      botMsgCount
    };
  };

  const addChatSession = async (sessionData) => {
    if (!isAuthenticated || !sessionData?.messages?.length) return false;

    try {
      const newSession = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        messages: sessionData.messages,
        summary: generateSummary(sessionData.messages)
      };
      
      const updatedHistory = [newSession, ...chatHistory];
      
      await axios.post("/api/user-data/save-data", {
        dataType: "chatHistory",
        data: updatedHistory
      });

      setChatHistory(updatedHistory);
      return true;
    } catch (error) {
      console.error("Error saving chat session:", error);
      return false;
    }
  };

  const deleteChatSession = async (sessionId) => {
    if (!isAuthenticated) return false;

    try {
      const updatedHistory = chatHistory.filter(session => session.id !== sessionId);
      
      await axios.post("/api/user-data/save-data", {
        dataType: "chatHistory",
        data: updatedHistory
      });

      setChatHistory(updatedHistory);
      return true;
    } catch (error) {
      console.error("Error deleting chat session:", error);
      return false;
    }
  };

  const deleteAllChatSessions = async () => {
    if (!isAuthenticated) return false;

    try {
      await axios.post("/api/user-data/save-data", {
        dataType: "chatHistory",
        data: []
      });

      setChatHistory([]);
      return true;
    } catch (error) {
      console.error("Error deleting all chat sessions:", error);
      return false;
    }
  };

  const getChatHistory = (count = null) => {
    return count ? chatHistory.slice(0, count) : chatHistory;
  };
  

  const value = {
    chatHistory,
    addChatSession,
    getChatHistory,
    deleteChatSession,
    deleteAllChatSessions,
    isLoading
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
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

export default ChatbotContext;
