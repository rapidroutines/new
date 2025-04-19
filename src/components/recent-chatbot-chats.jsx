import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ChevronRight, Sparkles, Trash2, XCircle, AlertCircle } from "lucide-react";
import { useChatbot } from "@/contexts/chatbot-context";

export const RecentChatbotChats = ({ maxItems = 2 }) => {
    const { getChatHistory, deleteChatSession, deleteAllChatSessions, isLoading } = useChatbot();
    const [expandedView, setExpandedView] = useState(false);
    const [notification, setNotification] = useState(null);
    
    const chatsToDisplay = expandedView 
        ? getChatHistory() 
        : getChatHistory(maxItems);
    
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };
    
    const showNotification = (type, message) => {
        setNotification({ type, message });
        
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };
    
    const handleDeleteChat = (e, chatId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
            const success = deleteChatSession(chatId);
            
            if (success) {
                showNotification("success", "Chat deleted successfully");
            }
        }
    };
    
    const handleDeleteAllChats = () => {
        if (confirm("Are you sure you want to delete ALL chat history? This action cannot be undone.")) {
            const success = deleteAllChatSessions();
            
            if (success) {
                showNotification("success", "All chat history deleted successfully");
            }
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg bg-white p-6 shadow-md">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e628c]"></div>
            </div>
        );
    }
    
    if (!chatsToDisplay || chatsToDisplay.length === 0) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold">Recent Chatbot Chats</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <p className="text-slate-600">You haven't had any chats with the AI assistant yet.</p>
                    <Link to="/chatbot" className="mt-3 text-sm font-medium text-[#1e628c] hover:underline">
                        Start a new conversation
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            {notification && (
                <div 
                    className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-3 pr-4 shadow-md transition-all ${
                        notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                    {notification.type === "success" ? (
                        <div className="flex items-center">
                            <div className="mr-2 rounded-full bg-green-200 p-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            {notification.message}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            {notification.message}
                        </div>
                    )}
                </div>
            )}
            
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Chatbot Chats</h2>
                <div className="flex items-center gap-2">
                    {getChatHistory().length > 0 && (
                        <button
                            onClick={handleDeleteAllChats}
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                            title="Delete all chats"
                        >
                            <XCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete All</span>
                        </button>
                    )}
                    
                    {getChatHistory().length > maxItems && (
                        <button
                            onClick={() => setExpandedView(!expandedView)}
                            className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                        >
                            {expandedView ? "Show Less" : "View All"}
                            <ChevronRight className="h-4 w-4" strokeWidth={2} />
                        </button>
                    )}
                </div>
            </div>
            
            <div className="space-y-4">
                {chatsToDisplay.map((chat) => (
                    <div 
                        key={chat.id} 
                        className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">{chat.summary.title}</h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formatDate(chat.timestamp)} • {chat.summary.messageCount} messages
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                    className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                    title="Delete this chat"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                                <span className="flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
                                    <span>{chat.summary.userMsgCount}</span> 
                                    <span className="hidden sm:inline">questions</span>
                                </span>
                                <span className="flex items-center gap-1 rounded-full bg-[#1e628c]/10 px-2 py-1 text-xs font-medium text-[#1e628c]">
                                    <Sparkles className="h-3 w-3" />
                                    <span>{chat.summary.botMsgCount}</span>
                                    <span className="hidden sm:inline">responses</span>
                                </span>
                            </div>
                        </div>
                        
                        {chat.messages && chat.messages.length > 0 && (
                            <div className="mt-3 max-h-20 overflow-hidden text-ellipsis border-t border-slate-200 pt-2 text-sm text-slate-600">
                                <div className="line-clamp-2">
                                    {chat.messages[0].content.length > 100 
                                        ? chat.messages[0].content.substring(0, 100) + "..." 
                                        : chat.messages[0].content}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-3 flex justify-end">
                            <Link 
                                to={`/chatbot?conversationId=${chat.id}`}
                                className="text-xs font-medium text-[#1e628c] hover:underline"
                            >
                                Continue conversation →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            
            {!expandedView && getChatHistory().length > maxItems && (
                <button
                    onClick={() => setExpandedView(true)}
                    className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Show All ({getChatHistory().length}) Chat Sessions
                </button>
            )}
            
            <div className="mt-4 text-center">
                <Link 
                    to="/chatbot"
                    className="text-sm font-medium text-[#1e628c] hover:underline"
                >
                    Start a new conversation
                </Link>
            </div>
        </div>
    );
};
