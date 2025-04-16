/**
 * Utility functions for iframe message handling
 */

/**
 * Send a message to an iframe
 * @param {HTMLIFrameElement} iframe - The iframe element to send the message to
 * @param {string} messageType - The type of message
 * @param {object} data - The data to send
 * @returns {boolean} - Whether the message was sent successfully
 */
export const sendMessageToIframe = (iframe, messageType, data = {}) => {
  if (!iframe || !iframe.contentWindow) {
    console.warn('No valid iframe provided to send message to');
    return false;
  }
  
  try {
    iframe.contentWindow.postMessage({
      type: messageType,
      ...data
    }, '*');  // Using * for development, should be more specific in production
    return true;
  } catch (error) {
    console.error('Error sending message to iframe:', error);
    return false;
  }
};

/**
 * Create a message handler for iframe messages
 * @param {array} allowedOrigins - The allowed origins for messages
 * @param {object} handlers - Object with message type handlers
 * @returns {function} - The message handler function
 */
export const createIframeMessageHandler = (allowedOrigins, handlers) => {
  return (event) => {
    // Skip origin check if allowedOrigins is empty
    const shouldCheckOrigin = allowedOrigins && allowedOrigins.length > 0;
    
    if (shouldCheckOrigin && !allowedOrigins.includes(event.origin)) {
      // Origin not in allowed list, ignore the message
      return;
    }
    
    // Check if the event has data and a type
    if (!event.data || !event.data.type) {
      return;
    }
    
    // Call the appropriate handler
    const handler = handlers[event.data.type];
    if (handler && typeof handler === 'function') {
      handler(event.data, event);
    }
  };
};

/**
 * Load chat history into an iframe
 * @param {HTMLIFrameElement} iframe - The iframe to load the chat into
 * @param {Array} messages - Array of message objects {role, content}
 * @returns {Promise} - Resolves when all messages are loaded
 */
export const loadChatHistory = async (iframe, messages) => {
  if (!iframe || !iframe.contentWindow || !Array.isArray(messages)) {
    console.warn('Invalid parameters for loading chat history');
    return false;
  }
  
  let success = true;
  
  // Add a small delay before starting to ensure iframe is ready
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Process each message in sequence
  for (const message of messages) {
    if (!message.role || !message.content) continue;
    
    const sent = sendMessageToIframe(iframe, "loadMessage", {
      role: message.role,
      content: message.content
    });
    
    if (!sent) success = false;
    
    // Small delay to ensure messages are processed in order
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  return success;
};