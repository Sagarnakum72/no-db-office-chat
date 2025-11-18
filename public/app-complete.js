// Complete Office Chat Application - All Features Working
console.log('🚀 Loading Complete Office Chat...');

// Global variables
let socket;
let currentUsername = null;
let isJoined = false;
let notificationPermission = false;

// Emoji database - simplified but complete
const emojiCategories = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'],
    gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇'],
    food: ['🍕', '🍔', '🍟', '🌭', '🍿', '🥓', '🥚', '🍳', '🧇', '🥞', '🍞', '🥐', '🥨', '🥯', '🥖', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🥫', '🍖', '🍗', '🥩', '🍠', '🥟', '🥠', '🥡', '🍱'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🔥', '💧', '🌊']
};

// Quick reactions for messages
const quickReactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '🔥'];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing chat...');
    
    // Initialize Socket.IO
    initializeSocket();
    
    // Initialize UI handlers
    initializeUI();
    
    // Initialize emoji picker
    initializeEmojiPicker();
    
    // Initialize image upload
    initializeImageUpload();
    
    console.log('🎉 Chat initialization complete!');
});

// Initialize Socket.IO connection
function initializeSocket() {
    console.log('🔌 Connecting to server...');
    
    socket = io({
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
        timeout: 10000
    });
    
    // Connection events
    socket.on('connect', function() {
        console.log('✅ Connected! Socket ID:', socket.id);
        updateConnectionStatus(true);
    });
    
    socket.on('disconnect', function(reason) {
        console.log('❌ Disconnected:', reason);
        updateConnectionStatus(false);
    });
    
    socket.on('connect_error', function(error) {
        console.error('❌ Connection error:', error);
        updateConnectionStatus(false);
    });
    
    // Chat events
    socket.on('chatMessage', function(message) {
        console.log('📨 Received:', message);
        displayMessage(message);
        
        // Notifications and sounds
        if (message.type === 'user' && message.user !== currentUsername) {
            playNotificationSound();
            showNotification(`New message from ${message.user}`, message.text);
        } else if (message.type === 'system') {
            playNotificationSound();
        }
    });
    
    socket.on('usersList', function(users) {
        console.log('👥 Users update:', users);
        updateUsersList(users);
    });
}

// Initialize UI event handlers
function initializeUI() {
    const joinBtn = document.getElementById('joinBtn');
    const usernameInput = document.getElementById('usernameInput');
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    
    // Join button
    if (joinBtn && usernameInput) {
        joinBtn.onclick = handleJoin;
        usernameInput.onkeypress = function(e) {
            if (e.key === 'Enter') handleJoin();
        };
    }
    
    // Send message
    if (sendBtn && messageInput) {
        sendBtn.onclick = sendMessage;
        messageInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        };
    }
}

// Handle join chat
function handleJoin() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();
    
    if (!username) {
        alert('Please enter your name');
        return;
    }
    
    if (username.length > 30) {
        alert('Name is too long (max 30 characters)');
        return;
    }
    
    currentUsername = username;
    isJoined = true;
    
    // Request notification permission
    requestNotificationPermission();
    
    // Join server
    socket.emit('join', { username: username });
    
    // Update UI
    updateUIAfterJoin(username);
    
    // Load messages
    loadExistingMessages();
    
    console.log('🎯 Joined as:', username);
}

// Update UI after joining
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
    if (!messageInput) return;
    
    const text = messageInput.value.trim();
    if (!text || !isJoined) return;
    
    console.log('📤 Sending:', text);
    socket.emit('chatMessage', { text: text });
    
    messageInput.value = '';
    messageInput.focus();
}

// Load existing messages
function loadExistingMessages() {
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
    } else if (message.type === 'image') {
        const isCurrentUser = message.user === currentUsername;
        messageDiv.classList.add(isCurrentUser ? 'user-message' : 'other-message');
        const time = formatTime(message.time);
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-user">${escapeHtml(message.user)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">
                ${message.text ? `<p>${escapeHtml(message.text)}</p>` : ''}
                <img src="${message.image}" class="message-image" alt="Shared image" onclick="window.open('${message.image}', '_blank')">
            </div>
        `;
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
            <div class="message-footer">
                <div class="message-reactions" id="reactions-${message.id}">
                    <button class="add-reaction-btn" onclick="showQuickReactions(event, ${message.id})" title="Add reaction">+</button>
                </div>
                ${isCurrentUser ? `<div class="message-status" id="status-${message.id}">
                    <span class="status-icon">✓</span>
                    <span class="status-text">Sent</span>
                </div>` : ''}
            </div>
        `;
    }
    
    messagesList.appendChild(messageDiv);
    
    if (shouldScroll) scrollToBottom();
}

// Initialize emoji picker
function initializeEmojiPicker() {
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    
    if (!emojiBtn || !emojiPicker) return;
    
    // Populate emoji grids
    Object.keys(emojiCategories).forEach(category => {
        const grid = document.getElementById(`${category}-grid`);
        if (grid) {
            emojiCategories[category].forEach(emoji => {
                const btn = document.createElement('button');
                btn.className = 'emoji-item';
                btn.textContent = emoji;
                btn.onclick = () => {
                    const messageInput = document.getElementById('messageInput');
                    if (messageInput) {
                        messageInput.value += emoji;
                        messageInput.focus();
                    }
                };
                grid.appendChild(btn);
            });
        }
    });
    
    // Emoji picker toggle
    emojiBtn.onclick = function() {
        const isVisible = emojiPicker.style.display === 'block';
        emojiPicker.style.display = isVisible ? 'none' : 'block';
    };
    
    // Tab switching
    document.querySelectorAll('.emoji-tab').forEach(tab => {
        tab.onclick = function() {
            const category = this.dataset.category;
            
            // Update active tab
            document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active category
            document.querySelectorAll('.emoji-category').forEach(c => c.classList.remove('active'));
            const targetCategory = document.querySelector(`.emoji-category[data-category="${category}"]`);
            if (targetCategory) targetCategory.classList.add('active');
        };
    });
    
    // Close on outside click
    document.onclick = function(e) {
        if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.style.display = 'none';
        }
    };
}

// Initialize image upload
function initializeImageUpload() {
    const imageBtn = document.getElementById('imageBtn');
    const imageInput = document.getElementById('imageInput');
    
    if (!imageBtn || !imageInput) return;
    
    imageBtn.onclick = () => imageInput.click();
    
    imageInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file
        if (file.size > 5 * 1024 * 1024) {
            alert('Image too large! Maximum size is 5MB.');
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        
        // Convert to base64 and send
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageData = event.target.result;
            socket.emit('chatMessage', {
                type: 'image',
                image: imageData,
                text: ''
            });
            console.log('📷 Image sent');
        };
        reader.readAsDataURL(file);
        
        // Reset input
        imageInput.value = '';
    };
}

// Show quick reactions - Fixed version
window.showQuickReactions = function(event, messageId) {
    event.stopPropagation();
    console.log('🎯 Opening reactions for message:', messageId);
    
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
        btn.className = 'emoji-item';
        btn.textContent = emoji;
        btn.style.width = '36px';
        btn.style.height = '36px';
        btn.style.border = 'none';
        btn.style.background = 'transparent';
        btn.style.borderRadius = '50%';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '18px';
        btn.style.transition = 'all 0.2s ease';
        
        btn.onmouseover = () => btn.style.background = '#f0f0f0';
        btn.onmouseout = () => btn.style.background = 'transparent';
        
        btn.onclick = () => {
            console.log('👍 Reacting with:', emoji);
            addReaction(messageId, emoji);
            picker.remove();
        };
        picker.appendChild(btn);
    });
    
    document.body.appendChild(picker);
    
    // Auto close after 5 seconds or on outside click
    setTimeout(() => {
        const closeHandler = (e) => {
            if (!picker.contains(e.target)) {
                picker.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        document.addEventListener('click', closeHandler);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (picker.parentNode) {
                picker.remove();
                document.removeEventListener('click', closeHandler);
            }
        }, 5000);
    }, 100);
}

// Add reaction to message
function addReaction(messageId, emoji) {
    if (!isJoined) return;
    console.log('👍 Adding reaction:', emoji, 'to message:', messageId);
    socket.emit('messageReaction', {
        messageId: messageId,
        emoji: emoji,
        username: currentUsername
    });
}

// Update connection status
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
        const isCurrentUser = username === currentUsername;
        
        userItem.innerHTML = `
            <div class="user-avatar">${initial}</div>
            <div class="user-name">${escapeHtml(username)}${isCurrentUser ? ' (You)' : ''}</div>
            <div class="user-status"></div>
        `;
        
        usersList.appendChild(userItem);
    });
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            notificationPermission = permission === 'granted';
        });
    } else if (Notification.permission === 'granted') {
        notificationPermission = true;
    }
}

// Show desktop notification
function showNotification(title, body) {
    if (notificationPermission && document.hidden) {
        new Notification(title, {
            body: body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'chat-message',
            requireInteraction: false
        });
    }
}

// Play notification sound
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
        console.log('🔇 Audio not supported');
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
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

console.log('✅ Complete Office Chat loaded successfully!');
//
 Update message status (delivered/seen)
function updateMessageStatus(messageId, status) {
    const statusElement = document.getElementById(`status-${messageId}`);
    if (!statusElement) return;
    
    const statusIcon = statusElement.querySelector('.status-icon');
    const statusText = statusElement.querySelector('.status-text');
    
    if (status === 'delivered') {
        statusIcon.textContent = '✓';
        statusText.textContent = 'Delivered';
        statusElement.className = 'message-status delivered';
    } else if (status === 'seen') {
        statusIcon.textContent = '✓✓';
        statusText.textContent = 'Seen';
        statusElement.className = 'message-status seen';
    }
}

// Display reactions on message
function displayReactions(messageId, reactions) {
    const reactionsContainer = document.getElementById(`reactions-${messageId}`);
    if (!reactionsContainer) return;
    
    // Clear existing reactions (keep add button)
    const addBtn = reactionsContainer.querySelector('.add-reaction-btn');
    reactionsContainer.innerHTML = '';
    
    // Group reactions by emoji
    const grouped = {};
    reactions.forEach(r => {
        if (!grouped[r.emoji]) {
            grouped[r.emoji] = [];
        }
        grouped[r.emoji].push(r.username);
    });
    
    // Display each reaction
    Object.keys(grouped).forEach(emoji => {
        const users = grouped[emoji];
        const btn = document.createElement('button');
        btn.className = 'reaction-btn';
        if (users.includes(currentUsername)) {
            btn.classList.add('reacted');
        }
        btn.innerHTML = `${emoji} <span class="reaction-count">${users.length}</span>`;
        btn.title = users.join(', ');
        btn.onclick = () => addReaction(messageId, emoji);
        reactionsContainer.appendChild(btn);
    });
    
    // Re-add the "+" button
    if (addBtn) {
        reactionsContainer.appendChild(addBtn);
    }
}

// Enhanced sound with visual feedback
function playNotificationSound() {
    try {
        // Add visual feedback
        document.body.classList.add('sound-playing');
        setTimeout(() => document.body.classList.remove('sound-playing'), 300);
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // More pleasant notification sound
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        
        console.log('🔊 Notification sound played');
    } catch (e) {
        console.log('🔇 Audio not supported:', e);
    }
}