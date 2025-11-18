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

// Track message delivery and read status
let messageStatus = new Map(); // messageId -> {delivered: [usernames], read: [usernames]}

// Track user sessions
let userSessions = new Map(); // username -> {socketId, joinTime, lastSeen}

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
    const isReconnect = data.isReconnect || false;
    socket.username = username;
    
    // Check if user already has a session
    const existingSession = userSessions.get(username);
    if (existingSession && !isReconnect) {
      // Update existing session
      existingSession.socketId = socket.id;
      existingSession.lastSeen = new Date().toISOString();
      console.log(`[Rejoin] ${username} reconnected (${socket.id})`);
    } else {
      // Create new session
      userSessions.set(username, {
        socketId: socket.id,
        joinTime: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      });
      
      // Only show join message for new users
      if (!isReconnect) {
        const systemMessage = {
          id: ++messageIdCounter,
          type: 'system',
          text: `${username} joined the chat`,
          time: new Date().toISOString()
        };
        
        addMessage(systemMessage);
        io.emit('chatMessage', systemMessage);
      }
      
      console.log(`[Join] ${username} joined (${socket.id})`);
    }
    
    // Add to online users
    onlineUsers.set(socket.id, username);
    console.log(`[Users] Online users: ${onlineUsers.size}`);
    
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
      time: new Date().toISOString(),
      status: 'sent'
    };
    
    // Add image data if present
    if (data.type === 'image' && data.image) {
      message.image = data.image;
      console.log(`[Image] ${message.user} sent an image`);
    } else {
      console.log(`[Message] ${message.user}: ${message.text}`);
    }
    
    // Initialize message status tracking
    messageStatus.set(message.id, {
      delivered: [],
      read: []
    });
    
    // Add to in-memory storage and broadcast to all clients
    addMessage(message);
    io.emit('chatMessage', message);
    
    // Mark as delivered for sender immediately
    setTimeout(() => {
      const status = messageStatus.get(message.id);
      if (status) {
        status.delivered.push(socket.username);
        socket.emit('messageStatusUpdate', {
          messageId: message.id,
          status: 'delivered',
          deliveredTo: status.delivered,
          readBy: status.read
        });
      }
    }, 500);
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
    const status = messageStatus.get(messageId);
    
    if (status) {
      // Add to delivered if not already there
      if (!status.delivered.includes(socket.username)) {
        status.delivered.push(socket.username);
      }
      
      // Add to read if not already there
      if (!status.read.includes(socket.username)) {
        status.read.push(socket.username);
        console.log(`[Read] ${socket.username} read message ${messageId}`);
        
        // Broadcast status update to all clients
        io.emit('messageStatusUpdate', {
          messageId: messageId,
          status: 'read',
          deliveredTo: status.delivered,
          readBy: status.read
        });
      }
    }
  });
  
  // Handle message delivery confirmation
  socket.on('messageDelivered', (data) => {
    if (!socket.username) return;
    
    const { messageId } = data;
    const status = messageStatus.get(messageId);
    
    if (status && !status.delivered.includes(socket.username)) {
      status.delivered.push(socket.username);
      console.log(`[Delivered] Message ${messageId} delivered to ${socket.username}`);
      
      // Broadcast delivery status to sender
      io.emit('messageStatusUpdate', {
        messageId: messageId,
        status: 'delivered',
        deliveredTo: status.delivered,
        readBy: status.read
      });
    }
  });
  
  // Handle user logout
  socket.on('logout', () => {
    if (socket.username) {
      console.log(`[Logout] ${socket.username} logged out`);
      
      // Remove session
      userSessions.delete(socket.username);
      
      // Create and broadcast system message
      const systemMessage = {
        id: ++messageIdCounter,
        type: 'system',
        text: `${socket.username} left the chat`,
        time: new Date().toISOString()
      };
      
      addMessage(systemMessage);
      io.emit('chatMessage', systemMessage);
    }
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
