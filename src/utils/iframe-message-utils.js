
export const sendMessageToIframe = (iframe, messageType, data = {}) => {
  if (!iframe || !iframe.contentWindow) {
    console.warn('No valid iframe provided to send message to');
    return false;
  }
  
  try {
    iframe.contentWindow.postMessage({
      type: messageType,
      ...data
    }, '*');  
    return true;
  } catch (error) {
    console.error('Error sending message to iframe:', error);
    return false;
  }
};


export const createIframeMessageHandler = (allowedOrigins, handlers) => {
  return (event) => {
    const shouldCheckOrigin = allowedOrigins && allowedOrigins.length > 0;
    
    if (shouldCheckOrigin && !allowedOrigins.includes(event.origin)) {
      return;
    }
    
    if (!event.data || !event.data.type) {
      return;
    }
    
    const handler = handlers[event.data.type];
    if (handler && typeof handler === 'function') {
      handler(event.data, event);
    }
  };
};


export const loadChatHistory = async (iframe, messages) => {
  if (!iframe || !iframe.contentWindow || !Array.isArray(messages)) {
    console.warn('Invalid parameters for loading chat history');
    return false;
  }
  
  let success = true;
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  for (const message of messages) {
    if (!message.role || !message.content) continue;
    
    const sent = sendMessageToIframe(iframe, "loadMessage", {
      role: message.role,
      content: message.content
    });
    
    if (!sent) success = false;
    
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  return success;
};
