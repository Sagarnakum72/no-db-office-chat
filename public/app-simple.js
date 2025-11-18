// Simple Working Office Chat - All Features Working
console.log('🚀 Loading Simple Office Chat...');

// Global variables
let socket;
let currentUsername = null;
let isJoined = false;

// Quick reactions
const quickReactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '🔥'];

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    
    // Initialize socket
    initSocket();
    
    // Initialize themes
    initThemes();
    
    // Check saved session
    checkSession();
    
    // Initialize UI handlers
    initUI();
    
    console.log('🎉 Chat ready!');
});

// Initialize Socket.IO
function initSocket() {
    socket = io({
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling']
    });
    
    socket.on('connect', function() {
        console.log('✅ Connected:', socket.id);
        updateStatus(true);
        
        // Auto-rejoin if session exists
        if (isJoined && currentUsername) {
            socket.emit('join', { username: currentUsername, isReconnect: true });
        }
    });
    
    socket.on('disconnect', function() {
        console.log('❌ Disconnected');
        updateStatus(false);
    });
    
    socket.on('chatMessage', function(message) {
        console.log('📨 Message:', message);
        displayMessage(message);
        
        // Send delivery/read receipts for others' messages
        if (message.type === 'user' && message.user !== currentUsername) {
            setTimeout(() => socket.emit('messageDelivered', { messageId: message.id }), 500);
            setTimeout(() => socket.emit('messageRead', { messageId: message.id }), 2000);
            playSound();
        }
    });
    
    socket.on('usersList', function(users) {
        updateUsers(users);
    });
    
    socket.on('messageStatusUpdate', function(data) {
        updateMessageStatus(data.messageId, data.status, data.readBy);
    });
    
    socket.on('reactionUpdate', function(data) {
        displayReactions(data.messageId, data.reactions);
    });
}

// Initialize themes
function initThemes() {
    const savedTheme = localStorage.getItem('chatTheme') || 'professional';
    applyTheme(savedTheme);
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.onclick = function() {
            const theme = this.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('chatTheme', theme);
        };
    });
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

// Check saved session
function checkSession() {
    const savedUsername = localStorage.getItem('chatUsername');
    const sessionActive = localStorage.getItem('chatSessionActive');
    
    if (savedUsername && sessionActive === 'true') {
        console.log('💾 Restoring session:', savedUsername);
        currentUsername = savedUsername;
        isJoined = true;
        updateUIAfterJoin(savedUsername);
        
        setTimeout(() => {
            if (socket && socket.connected) {
                socket.emit('join', { username: savedUsername, isReconnect: true });
                loadMessages();
            }
        }, 1000);
    }
}

// Initialize UI handlers
function initUI() {
    const joinBtn = document.getElementById('joinBtn');
    const usernameInput = document.getElementById('usernameInput');
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const emojiBtn = document.getElementById('emojiBtn');
    const imageBtn = document.getElementById('imageBtn');
    const imageInput = document.getElementById('imageInput');
    
    // Join handler
    if (joinBtn && usernameInput) {
        joinBtn.onclick = handleJoin;
        usernameInput.onkeypress = (e) => e.key === 'Enter' && handleJoin();
    }
    
    // Message handlers
    if (sendBtn && messageInput) {
        sendBtn.onclick = sendMessage;
        messageInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        };
    }
    
    // Emoji handler
    if (emojiBtn) {
        emojiBtn.onclick = toggleEmojiPicker;
    }
    
    // Image handler
    if (imageBtn && imageInput) {
        imageBtn.onclick = () => imageInput.click();
        imageInput.onchange = handleImageUpload;
    }
}

// Handle join
function handleJoin() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();
    
    if (!username) {
        alert('Please enter your name');
        return;
    }
    
    currentUsername = username;
    isJoined = true;
    
    // Save session
    localStorage.setItem('chatUsername', username);
    localStorage.setItem('chatSessionActive', 'true');
    
    // Join server
    socket.emit('join', { username });
    
    // Update UI
    updateUIAfterJoin(username);
    loadMessages();
    
    console.log('🎯 Joined as:', username);
}

function updateUIAfterJoin(username) {
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
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();
    
    if (!text || !isJoined) return;
    
    socket.emit('chatMessage', { text });
    messageInput.value = '';
    messageInput.focus();
}

// Load messages
function loadMessages() {
    fetch('/messages')
        .then(res => res.json())
        .then(messages => {
            const messagesList = document.getElementById('messagesList');
            if (messagesList) {
                messagesList.innerHTML = '';
                messages.forEach(msg => displayMessage(msg, false));
                scrollToBottom();
            }
        })
        .catch(err => console.error('Error loading messages:', err));
}

// Display message
function displayMessage(message, shouldScroll = true) {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.dataset.messageId = message.id;
    
    if (message.type === 'system') {
        messageDiv.classList.add('system-message');
        messageDiv.innerHTML = `<div class="message-content">${escapeHtml(message.text)}</div>`;
    } else {
        const isCurrentUser = message.user === currentUsername;
        messageDiv.classList.add(isCurrentUser ? 'user-message' : 'other-message');
        const time = formatTime(message.time);
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-user">${escapeHtml(message.user)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${escapeHtml(message.text)}</div>
            <div class="message-reactions" id="reactions-${message.id}">
                <button class="add-reaction-btn" onclick="showQuickReactions(event, ${message.id})" title="Add reaction">+</button>
            </div>
            ${isCurrentUser ? `<div class="message-status" id="status-${message.id}">
                <span class="status-icon">✓</span>
                <span class="status-text">Sent</span>
            </div>` : ''}
        `;
    }
    
    messagesList.appendChild(messageDiv);
    if (shouldScroll) scrollToBottom();
}

// Show quick reactions - Global function
window.showQuickReactions = function(event, messageId) {
    event.stopPropagation();
    
    // Remove existing picker
    const existing = document.querySelector('.reaction-picker');
    if (existing) existing.remove();
    
    // Create picker
    const picker = document.createElement('div');
    picker.className = 'reaction-picker';
    picker.style.position = 'fixed';
    picker.style.left = Math.min(event.clientX, window.innerWidth - 300) + 'px';
    picker.style.top = Math.max(event.clientY - 60, 10) + 'px';
    picker.style.zIndex = '10000';
    picker.style.background = 'white';
    picker.style.borderRadius = '24px';
    picker.style.padding = '8px';
    picker.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    picker.style.display = 'flex';
    picker.style.gap = '4px';
    
    quickReactions.forEach(emoji => {
        const btn = document.createElement('button');
        btn.textContent = emoji;
        btn.style.cssText = `
            width: 36px; height: 36px; border: none; background: transparent;
            border-radius: 50%; cursor: pointer; font-size: 18px;
            transition: all 0.2s ease; display: flex; align-items: center;
            justify-content: center;
        `;
        
        btn.onmouseover = () => btn.style.background = '#f0f0f0';
        btn.onmouseout = () => btn.style.background = 'transparent';
        btn.onclick = () => {
            addReaction(messageId, emoji);
            picker.remove();
        };
        
        picker.appendChild(btn);
    });
    
    document.body.appendChild(picker);
    
    // Auto close
    setTimeout(() => {
        const closeHandler = (e) => {
            if (!picker.contains(e.target)) {
                picker.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        document.addEventListener('click', closeHandler);
        setTimeout(() => picker.remove(), 5000);
    }, 100);
};

// Add reaction
function addReaction(messageId, emoji) {
    if (!isJoined) return;
    socket.emit('messageReaction', {
        messageId: messageId,
        emoji: emoji,
        username: currentUsername
    });
}

// Display reactions
function displayReactions(messageId, reactions) {
    const container = document.getElementById(`reactions-${messageId}`);
    if (!container) return;
    
    // Clear existing reactions but keep + button
    const addBtn = container.querySelector('.add-reaction-btn');
    container.innerHTML = '';
    
    // Group reactions by emoji
    const grouped = {};
    reactions.forEach(r => {
        if (!grouped[r.emoji]) grouped[r.emoji] = [];
        grouped[r.emoji].push(r.username);
    });
    
    // Display reactions
    Object.keys(grouped).forEach(emoji => {
        const users = grouped[emoji];
        const btn = document.createElement('button');
        btn.className = 'reaction-btn';
        if (users.includes(currentUsername)) btn.classList.add('reacted');
        btn.innerHTML = `${emoji} <span class="reaction-count">${users.length}</span>`;
        btn.title = users.join(', ');
        btn.onclick = () => addReaction(messageId, emoji);
        container.appendChild(btn);
    });
    
    // Re-add + button
    if (addBtn) container.appendChild(addBtn);
}

// Update message status (WhatsApp style)
function updateMessageStatus(messageId, status, readBy = []) {
    const statusElement = document.getElementById(`status-${messageId}`);
    if (!statusElement) return;
    
    const statusIcon = statusElement.querySelector('.status-icon');
    const statusText = statusElement.querySelector('.status-text');
    
    if (readBy.length > 0) {
        statusIcon.textContent = '✓✓';
        statusIcon.style.color = '#4fc3f7'; // Blue ticks
        statusText.textContent = 'Read';
        statusElement.className = 'message-status read';
    } else if (status === 'delivered') {
        statusIcon.textContent = '✓✓';
        statusIcon.style.color = '#9e9e9e'; // Gray ticks
        statusText.textContent = 'Delivered';
        statusElement.className = 'message-status delivered';
    } else {
        statusIcon.textContent = '✓';
        statusIcon.style.color = '#9e9e9e';
        statusText.textContent = 'Sent';
        statusElement.className = 'message-status sent';
    }
}

// Update connection status
function updateStatus(connected) {
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

// Update users list
function updateUsers(users) {
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
        const isCurrentUser = username === currentUsername;
        
        userItem.innerHTML = `
            <div class="user-avatar">${initial}</div>
            <div class="user-name">${escapeHtml(username)}${isCurrentUser ? ' (You)' : ''}</div>
            <div class="user-status"></div>
        `;
        
        usersList.appendChild(userItem);
    });
}

// Emoji picker toggle
function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    if (emojiPicker) {
        const isVisible = emojiPicker.style.display === 'block';
        emojiPicker.style.display = isVisible ? 'none' : 'block';
    }
}

// Image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Image too large! Max 5MB.');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        socket.emit('chatMessage', {
            type: 'image',
            image: event.target.result,
            text: ''
        });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

// Play notification sound
function playSound() {
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

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    if (container) container.scrollTop = container.scrollHeight;
}

console.log('✅ Simple Office Chat loaded - All features working!');