// Essential fixes for join and message functionality

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('App fix loaded');
    
    const joinBtn = document.getElementById('joinBtn');
    const usernameInput = document.getElementById('usernameInput');
    
    // Fix join button
    if (joinBtn && usernameInput) {
        joinBtn.onclick = function() {
            const username = usernameInput.value.trim();
            
            if (!username) {
                alert('Please enter your name');
                return;
            }
            
            if (username.length > 30) {
                alert('Name is too long (max 30 characters)');
                return;
            }
            
            // Set current username
            window.currentUsername = username;
            window.isJoined = true;
            
            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
            
            // Emit join event
            if (window.socket) {
                window.socket.emit('join', { username: username });
            }
            
            // Update UI
            const joinSection = document.getElementById('joinSection');
            const userInfo = document.getElementById('userInfo');
            const currentUsernameSpan = document.getElementById('currentUsername');
            const messageInput = document.getElementById('messageInput');
            const sendBtn = document.getElementById('sendBtn');
            const emojiBtn = document.getElementById('emojiBtn');
            const imageBtn = document.getElementById('imageBtn');
            
            if (joinSection) joinSection.style.display = 'none';
            if (userInfo) userInfo.style.display = 'block';
            if (currentUsernameSpan) currentUsernameSpan.textContent = username;
            if (messageInput) messageInput.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            if (emojiBtn) emojiBtn.disabled = false;
            if (imageBtn) imageBtn.disabled = false;
            if (messageInput) messageInput.focus();
            
            // Load existing messages
            fetch('/messages')
                .then(res => res.json())
                .then(messages => {
                    const messagesList = document.getElementById('messagesList');
                    if (messagesList) {
                        messagesList.innerHTML = '';
                        messages.forEach(msg => {
                            // Display each message (simplified)
                            const div = document.createElement('div');
                            div.className = 'message';
                            if (msg.type === 'system') {
                                div.classList.add('system-message');
                                div.innerHTML = `<div class="message-content">${escapeHtml(msg.text)}</div>`;
                            } else {
                                const isCurrentUser = msg.user === username;
                                div.classList.add(isCurrentUser ? 'user-message' : 'other-message');
                                const time = new Date(msg.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                div.innerHTML = `
                                    <div class="message-header">
                                        <span class="message-user">${escapeHtml(msg.user)}</span>
                                        <span class="message-time">${time}</span>
                                    </div>
                                    <div class="message-content">${escapeHtml(msg.text)}</div>
                                `;
                            }
                            messagesList.appendChild(div);
                        });
                        
                        // Scroll to bottom
                        const container = document.getElementById('messagesContainer');
                        if (container) container.scrollTop = container.scrollHeight;
                    }
                })
                .catch(err => console.error('Error loading messages:', err));
            
            console.log('Joined as:', username);
        };
        
        // Enter key support
        usernameInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                joinBtn.click();
            }
        };
    }
    
    // Fix message sending
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    
    if (sendBtn && messageInput) {
        // Send button click
        sendBtn.onclick = function() {
            sendMessage();
        };
        
        // Enter key in message input
        messageInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        };
    }
    
    // Send message function
    function sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;
        
        const text = messageInput.value.trim();
        
        if (!text) {
            return;
        }
        
        if (!window.isJoined) {
            alert('Please join the chat first');
            return;
        }
        
        console.log('Sending message:', text);
        
        // Emit message to server
        if (window.socket) {
            window.socket.emit('chatMessage', { text: text });
        }
        
        // Clear input
        messageInput.value = '';
        messageInput.focus();
    }
    
    // Initialize Socket.IO connection immediately
    console.log('Initializing Socket.IO...');
    
    const socket = io({
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
        timeout: 5000
    });
    
    // Make socket globally available
    window.socket = socket;
    
    // Connection handlers
    socket.on('connect', function() {
        console.log('✅ Connected to server! Socket ID:', socket.id);
        updateConnectionStatus(true);
    });
    
    socket.on('disconnect', function(reason) {
        console.log('❌ Disconnected from server. Reason:', reason);
        updateConnectionStatus(false);
    });
    
    socket.on('connect_error', function(error) {
        console.error('Connection error:', error);
        updateConnectionStatus(false);
    });
    
    // Message handlers
    socket.on('chatMessage', function(message) {
        console.log('Received message:', message);
        displayMessage(message);
        
        // Play notification sound for other users
        if (message.type === 'user' && message.user !== window.currentUsername) {
            try {
                playNotificationSound();
            } catch (e) {
                console.log('Sound error:', e);
            }
        }
    });
    
    socket.on('usersList', function(users) {
        console.log('Online users:', users);
        updateUsersList(users);
    });
    
    // Update connection status in UI
    function updateConnectionStatus(connected) {
        const statusText = document.getElementById('statusText');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusText && statusDot) {
            if (connected) {
                statusText.textContent = 'Connected';
                statusDot.classList.add('connected');
            } else {
                statusText.textContent = 'Connecting...';
                statusDot.classList.remove('connected');
            }
        }
    }
    
    // Display message function
    function displayMessage(message) {
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        if (message.type === 'system') {
            messageDiv.classList.add('system-message');
            messageDiv.innerHTML = `<div class="message-content">${escapeHtml(message.text)}</div>`;
        } else {
            const isCurrentUser = message.user === window.currentUsername;
            messageDiv.classList.add(isCurrentUser ? 'user-message' : 'other-message');
            
            const time = new Date(message.time).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-user">${escapeHtml(message.user)}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-content">${escapeHtml(message.text)}</div>
            `;
        }
        
        messagesList.appendChild(messageDiv);
        
        // Scroll to bottom
        const container = document.getElementById('messagesContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
    
    // Update users list
    function updateUsersList(users) {
        const usersList = document.getElementById('usersList');
        const userCount = document.getElementById('userCount');
        
        if (userCount) userCount.textContent = users.length;
        
        if (!usersList) return;
        
        if (users.length === 0) {
            usersList.innerHTML = '<p class="no-users">No users online</p>';
            return;
        }
        
        usersList.innerHTML = '';
        
        users.forEach(username => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            
            const initial = username.charAt(0).toUpperCase();
            const isCurrentUser = username === window.currentUsername;
            
            userItem.innerHTML = `
                <div class="user-avatar">${initial}</div>
                <div class="user-name">${escapeHtml(username)}${isCurrentUser ? ' (You)' : ''}</div>
                <div class="user-status"></div>
            `;
            
            usersList.appendChild(userItem);
        });
    }
    
    // Simple notification sound
    function playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    // Helper function
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
