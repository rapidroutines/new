import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "@/layouts/footer";
import { MessageSquare } from "lucide-react";
import { useChatbot } from "@/contexts/chatbot-context";
import { sendMessageToIframe, createIframeMessageHandler, loadChatHistory } from "@/utils/iframe-message-utils";

const ChatbotPage = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [chatEnded, setChatEnded] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const iframeRef = useRef(null);
    const { addChatSession, getChatHistory } = useChatbot();
    
    const conversationId = searchParams.get('conversationId');
    
    const currentConversation = useRef([]);
    
    const handleChatEnd = () => {
        if (chatEnded) return; 
        
        if (currentConversation.current.length > 0) {
            console.log("Saving chat conversation:", currentConversation.current);
            
            addChatSession({
                messages: currentConversation.current
            });
            
            setChatEnded(true);
        }
    };
    
    useEffect(() => {
        const loadPreviousConversation = async () => {
            if (!conversationId || !iframeLoaded || !iframeRef.current) return;
            
            const chatHistory = getChatHistory();
            const conversation = chatHistory.find(chat => chat.id.toString() === conversationId);
            
            if (conversation && conversation.messages && conversation.messages.length > 0) {
                console.log("Loading previous conversation:", conversation);
                
                currentConversation.current = [...conversation.messages];
                
                setTimeout(async () => {
                    const success = await loadChatHistory(iframeRef.current, conversation.messages);
                    
                    if (success) {
                        console.log("Successfully loaded conversation history");
                    } else {
                        console.error("Failed to load conversation history");
                    }
                }, 1500);
            }
        };
        
        loadPreviousConversation();
    }, [conversationId, getChatHistory, iframeLoaded]);
    
    useEffect(() => {
        return () => {
            handleChatEnd();
        };
    }, []);
    
    useEffect(() => {
        const allowedOrigins = [
            "https://render-chatbot-di08.onrender.com",
            "https://render-chatbot.vercel.app",
            "https://render-chatbot.onrender.com"
        ];
        
        const messageHandlers = {
            chatMessage: (data) => {
                const { role, content } = data;
                
                currentConversation.current.push({
                    role,
                    content,
                    timestamp: new Date().toISOString()
                });
                
                console.log("Received chat message:", { role, content });
            },
            chatEnded: () => {
                handleChatEnd();
            }
        };
        
        const handleMessage = createIframeMessageHandler(allowedOrigins, messageHandlers);
        
        window.addEventListener("message", handleMessage);
        
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [addChatSession]);

    return (
        <div className="flex flex-col gap-y-6">
            <div className="relative w-full h-[700px] rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-md">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 z-10">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent dark:border-blue-400"></div>
                    </div>
                )}
                
                <div className="h-full w-full p-0">
                    <iframe 
                        ref={iframeRef}
                        src="https://render-chatbot-di08.onrender.com" 
                        className="h-full w-full border-0"
                        onLoad={() => {
                            setIsLoading(false);
                            setIframeLoaded(true);
                            setChatEnded(false);
                            
                            if (!conversationId) {
                                currentConversation.current = []; 
                            }
                        }}
                        title="Chatbot Interface"
                        style={{ borderRadius: '0.75rem' }}
                    ></iframe>
                </div>
            </div>
            
            <div className="text-center text-sm text-slate-600">
                <p>Your chat conversations are automatically saved when you finish chatting if you are signed in.</p>
            </div>

            <Footer />
        </div>
    );
};

export default ChatbotPage;
