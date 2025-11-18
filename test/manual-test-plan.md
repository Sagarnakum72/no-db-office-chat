# Manual Test Plan for no-db-office-chat

This document provides manual testing procedures and examples for validating the application.

## Prerequisites

- Application running on `http://localhost:3000`
- curl installed (for API testing)
- Node.js installed (for Socket.IO client testing)

## Test 1: Basic Web Interface

1. Open browser to `http://localhost:3000`
2. Verify page loads with join form
3. Enter username "Alice" and click "Join Chat"
4. Verify:
   - Join form disappears
   - User info shows "Logged in as Alice"
   - Message input is enabled
   - Connection status shows "Connected"

## Test 2: Multi-User Chat

1. Open first browser tab, join as "Alice"
2. Open second browser tab (or incognito), join as "Bob"
3. In Alice's tab, verify system message: "Bob joined the chat"
4. Send message from Alice: "Hello Bob!"
5. Verify message appears in both tabs
6. Send message from Bob: "Hi Alice!"
7. Verify message appears in both tabs
8. Close Bob's tab
9. In Alice's tab, verify system message: "Bob left the chat"

## Test 3: Message Persistence (In-Memory)

1. Join as "Alice" and send 3 messages
2. Open new tab and join as "Bob"
3. Verify Bob sees Alice's previous messages
4. Restart the server
5. Open browser and join
6. Verify all messages are gone (in-memory storage cleared)

## Test 4: REST API - Get Messages

Test the `/messages` endpoint using curl:

```bash
# Get all messages (should return empty array initially)
curl http://localhost:3000/messages

# Expected output:
# []
```

After sending some messages through the web interface:

```bash
curl http://localhost:3000/messages

# Expected output (example):
# [
#   {
#     "id": 1,
#     "type": "system",
#     "text": "Alice joined the chat",
#     "time": "2025-11-18T10:30:00.000Z"
#   },
#   {
#     "id": 2,
#     "type": "user",
#     "user": "Alice",
#     "text": "Hello everyone!",
#     "time": "2025-11-18T10:30:15.000Z"
#   }
# ]
```

## Test 5: Socket.IO Client (Programmatic)

Create a test file `socket-test.js`:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
  
  // Join the chat
  socket.emit('join', { username: 'TestBot' });
  
  // Send a message after 1 second
  setTimeout(() => {
    socket.emit('chatMessage', { text: 'Hello from automated test!' });
  }, 1000);
});

socket.on('chatMessage', (message) => {
  console.log('Received message:', message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Disconnect after 5 seconds
setTimeout(() => {
  socket.disconnect();
  process.exit(0);
}, 5000);
```

Run the test:

```bash
# Install socket.io-client first
npm install socket.io-client

# Run the test
node socket-test.js
```

Expected output:
```
Connected to server
Received message: { id: 1, type: 'system', text: 'TestBot joined the chat', time: '...' }
Received message: { id: 2, type: 'user', user: 'TestBot', text: 'Hello from automated test!', time: '...' }
Disconnected from server
```

## Test 6: Environment Variables

Test custom configuration:

```bash
# Test custom port
PORT=8080 node server.js
# Open browser to http://localhost:8080

# Test custom message limit
MAX_MESSAGES=10 node server.js
# Send 15 messages and verify only last 10 are kept
```

## Test 7: Graceful Shutdown

1. Start the server: `npm start`
2. Join chat and send some messages
3. Press Ctrl+C in the terminal
4. Verify:
   - Server logs "Received SIGINT, closing server gracefully..."
   - Server logs "HTTP server closed"
   - Server logs "Socket.IO closed"
   - Process exits cleanly

## Test 8: XSS Protection

1. Join chat as "Alice"
2. Try to send message with HTML: `<script>alert('XSS')</script>`
3. Verify:
   - Message appears as plain text (HTML escaped)
   - No script execution occurs
   - Message displays: `<script>alert('XSS')</script>` as text

## Test 9: Input Validation

1. Try to join with empty username
   - Verify: Alert "Please enter your name"
2. Try to join with very long username (>30 chars)
   - Verify: Alert "Name is too long"
3. Try to send empty message
   - Verify: Nothing happens, input remains empty

## Test 10: Responsive Design

1. Open application in browser
2. Resize window to mobile size (< 768px width)
3. Verify:
   - Sidebar stacks on top
   - Chat section below
   - All elements remain usable
   - No horizontal scrolling

## Test 11: Docker Deployment

```bash
# Build Docker image
cd no-db-office-chat
docker build -t no-db-office-chat -f docker/Dockerfile .

# Run container
docker run -p 3000:3000 no-db-office-chat

# Test in browser
# Open http://localhost:3000

# Test with docker-compose
docker-compose -f docker/docker-compose.yml up -d

# Check logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop
docker-compose -f docker/docker-compose.yml down
```

## Test Results Template

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Basic Web Interface | ☐ Pass ☐ Fail | |
| 2 | Multi-User Chat | ☐ Pass ☐ Fail | |
| 3 | Message Persistence | ☐ Pass ☐ Fail | |
| 4 | REST API | ☐ Pass ☐ Fail | |
| 5 | Socket.IO Client | ☐ Pass ☐ Fail | |
| 6 | Environment Variables | ☐ Pass ☐ Fail | |
| 7 | Graceful Shutdown | ☐ Pass ☐ Fail | |
| 8 | XSS Protection | ☐ Pass ☐ Fail | |
| 9 | Input Validation | ☐ Pass ☐ Fail | |
| 10 | Responsive Design | ☐ Pass ☐ Fail | |
| 11 | Docker Deployment | ☐ Pass ☐ Fail | |

## Known Limitations

- Messages are stored in memory only (lost on restart)
- No user authentication or authorization
- No message history pagination
- No private messaging
- No file uploads
- No message editing or deletion
- Single chat room only
