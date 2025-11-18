const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Configuration from environment variables
const PORT = process.env.PORT || 3000;
const MAX_MESSAGES = parseInt(process.env.MAX_MESSAGES || '200', 10);

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory message storage (bounded array)
let messages = [];
let messageIdCounter = 0;

// Track online users
let onlineUsers = new Map(); // socketId -> username

// Track message reactions
let messageReactions = new Map(); // messageId -> [{emoji, username}]

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to retrieve recent messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`[Socket] New connection: ${socket.id}`);
  
  // Handle user joining the chat
  socket.on('join', (data) => {
    const username = data.username || 'Anonymous';
    socket.username = username;
    
    // Add to online users
    onlineUsers.set(socket.id, username);
    
    console.log(`[Join] ${username} joined (${socket.id})`);
    console.log(`[Users] Online users: ${onlineUsers.size}`);
    
    // Create and broadcast system message
    const systemMessage = {
      id: ++messageIdCounter,
      type: 'system',
      text: `${username} joined the chat`,
      time: new Date().toISOString()
    };
    
    addMessage(systemMessage);
    io.emit('chatMessage', systemMessage);
    
    // Broadcast updated users list to all clients
    broadcastUsersList();
  });
  
  // Handle incoming chat messages
  socket.on('chatMessage', (data) => {
    if (!socket.username) {
      console.log(`[Warning] Message from non-joined socket: ${socket.id}`);
      return;
    }
    
    // Create message object
    const message = {
      id: ++messageIdCounter,
      type: data.type || 'user',
      user: socket.username,
      text: data.text || '',
      time: new Date().toISOString()
    };
    
    // Add image data if present
    if (data.type === 'image' && data.image) {
      message.image = data.image;
      console.log(`[Image] ${message.user} sent an image`);
    } else {
      console.log(`[Message] ${message.user}: ${message.text}`);
    }
    
    // Add to in-memory storage and broadcast to all clients
    addMessage(message);
    io.emit('chatMessage', message);
  });
  
  // Handle message reactions
  socket.on('messageReaction', (data) => {
    if (!socket.username) return;
    
    const { messageId, emoji, username } = data;
    
    // Get or create reactions array for this message
    if (!messageReactions.has(messageId)) {
      messageReactions.set(messageId, []);
    }
    
    const reactions = messageReactions.get(messageId);
    
    // Check if user already reacted with this emoji
    const existingIndex = reactions.findIndex(r => r.username === username && r.emoji === emoji);
    
    if (existingIndex >= 0) {
      // Remove reaction (toggle off)
      reactions.splice(existingIndex, 1);
      console.log(`[Reaction] ${username} removed ${emoji} from message ${messageId}`);
    } else {
      // Add reaction
      reactions.push({ emoji, username });
      console.log(`[Reaction] ${username} added ${emoji} to message ${messageId}`);
    }
    
    // Broadcast updated reactions
    io.emit('reactionUpdate', {
      messageId: messageId,
      reactions: reactions
    });
  });
  
  // Handle message read receipts
  socket.on('messageRead', (data) => {
    if (!socket.username) return;
    
    const { messageId } = data;
    console.log(`[Read] ${socket.username} read message ${messageId}`);
    
    // Broadcast read receipt to message sender
    socket.broadcast.emit('messageReadReceipt', {
      messageId: messageId,
      readBy: socket.username,
      readAt: new Date().toISOString()
    });
  });
  
  // Handle user disconnection
  socket.on('disconnect', () => {
    if (socket.username) {
      console.log(`[Disconnect] ${socket.username} left (${socket.id})`);
      
      // Remove from online users
      onlineUsers.delete(socket.id);
      console.log(`[Users] Online users: ${onlineUsers.size}`);
      
      // Create and broadcast system message
      const systemMessage = {
        id: ++messageIdCounter,
        type: 'system',
        text: `${socket.username} left the chat`,
        time: new Date().toISOString()
      };
      
      addMessage(systemMessage);
      io.emit('chatMessage', systemMessage);
      
      // Broadcast updated users list to all clients
      broadcastUsersList();
    } else {
      console.log(`[Disconnect] ${socket.id} disconnected`);
    }
  });
});

/**
 * Broadcast the current list of online users to all connected clients
 */
function broadcastUsersList() {
  const users = Array.from(onlineUsers.values());
  io.emit('usersList', users);
  console.log(`[Broadcast] Users list: ${users.join(', ')}`);
}

/**
 * Add message to in-memory storage with bounded length
 * Keeps only the most recent MAX_MESSAGES messages
 */
function addMessage(message) {
  messages.push(message);
  
  // Trim array if it exceeds maximum length
  if (messages.length > MAX_MESSAGES) {
    messages = messages.slice(-MAX_MESSAGES);
  }
}

// Start the server
server.listen(PORT, () => {
  console.log(`[Server] no-db-office-chat running on port ${PORT}`);
  console.log(`[Config] MAX_MESSAGES: ${MAX_MESSAGES}`);
  console.log(`[Info] Open http://localhost:${PORT} in your browser`);
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`\n[Shutdown] Received ${signal}, closing server gracefully...`);
  
  // Close server to stop accepting new connections
  server.close(() => {
    console.log('[Shutdown] HTTP server closed');
    
    // Close all socket connections
    io.close(() => {
      console.log('[Shutdown] Socket.IO closed');
      process.exit(0);
    });
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('[Shutdown] Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Register shutdown handlers
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
