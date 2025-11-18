// Complete Working Office Chat - All Features Fixed
console.log('🚀 Loading Complete Working Office Chat...');

// Global variables
let socket;
let currentUsername = null;
let isJoined = false;

// Quick reactions for messages
const quickReactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '🔥', '🎉', '💯', '✨'];

// Complete emoji database - World's most used emojis
const emojiDatabase = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
    gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    food: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧈', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈', '🍞', '🥐', '🥨', '🥯', '🥖', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🫔', '🥫', '🍖', '🍗', '🥩', '🍠', '🥟', '🥠', '🥡', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊', '🏄', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🕋'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪒', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧', '🔥', '💧', '🌊', '🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🎀', '🎁', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🪄', '🧿', '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🪅', '🪆', '♟️', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢']
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing...');
    
    // Initialize Socket.IO first
    initializeSocket();
    
    // Initialize themes
    initializeThemes();
    
    // Check for saved session
    checkSavedSession();
    
    // Initialize all UI handlers
    initializeAllHandlers();
    
    console.log('🎉 All features initialized!');
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
        
        // Auto-rejoin if session exists
        if (isJoined && currentUsername) {
            socket.emit('join', { username: currentUsername, isReconnect: true });
        }
    });
    
    socket.on('disconnect', function(reason) {
        console.log('❌ Disconnected:', reason);
        updateConnectionStatus(false);
    });
    
    socket.on('connect_error', function(error) {
        console.error('❌ Connection error:', error);
        updateConnectionStatus(false);
    });
    
    // Message events
    socket.on('chatMessage', function(message) {
        console.log('📨 Received message:', message);
        displayMessage(message);
        
        // Handle delivery and read receipts
        if (message.type === 'user' && message.user !== currentUsername) {
            // Send delivery confirmation
            setTimeout(() => {
                socket.emit('messageDelivered', { messageId: message.id });
            }, 500);
            
            // Send read receipt after 2 seconds
            setTimeout(() => {
                socket.emit('messageRead', { messageId: message.id });
            }, 2000);
            
            // Play notification sound
            playNotificationSound();
        }
    });
    
    socket.on('usersList', function(users) {
        console.log('👥 Users update:', users);
        updateUsersList(users);
    });
    
    // Message status updates (WhatsApp style)
    socket.on('messageStatusUpdate', function(data) {
        console.log('📋 Status update:', data);
        updateMessageStatus(data.messageId, data.status, data.readBy);
    });
    
    // Reaction updates
    socket.on('reactionUpdate', function(data) {
        console.log('👍 Reaction update:', data);
        displayReactions(data.messageId, data.reactions);
    });
}

// Initialize themes
function initializeThemes() {
    console.log('🎨 Initializing themes...');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('chatTheme') || 'professional';
    applyTheme(savedTheme);
    
    // Theme button handlers
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.onclick = function() {
            const theme = this.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('chatTheme', theme);
            console.log('🎨 Theme changed to:', theme);
        };
    });
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
}

// Check for saved session
function checkSavedSession() {
    const savedUsername = localStorage.getItem('chatUsername');
    const sessionActive = localStorage.getItem('chatSessionActive');
    
    if (savedUsername && sessionActive === 'true') {
        console.log('💾 Restoring session for:', savedUsername);
        
        currentUsername = savedUsername;
        isJoined = true;
        
        // Update UI immediately
        updateUIAfterJoin(savedUsername);
        
        // Wait for socket connection then rejoin
        setTimeout(() => {
            if (socket && socket.connected) {
                socket.emit('join', { username: savedUsername, isReconnect: true });
                loadExistingMessages();
            }
        }, 1000);
        
        return true;
    }
    return false;
}

// Initialize all UI handlers
function initializeAllHandlers() {
    console.log('🎛️ Setting up UI handlers...');
    
    // Join button handler
    const joinBtn = document.getElementById('joinBtn');
    const usernameInput = document.getElementById('usernameInput');
    
    if (joinBtn && usernameInput) {
        joinBtn.onclick = handleJoin;
        
        // Enter key handler for username input
        usernameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleJoin();
            }
        });
        
        console.log('✅ Join handlers set');
    }
    
    // Message sending handlers
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    
    if (sendBtn && messageInput) {
        sendBtn.onclick = sendMessage;
        
        // Enter key handler for message input
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
        
        console.log('✅ Message handlers set');
    }
    
    // Emoji picker handler
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    
    if (emojiBtn && emojiPicker) {
        // Populate emoji picker with all emojis
        populateEmojiPicker();
        
        emojiBtn.onclick = function() {
            const isVisible = emojiPicker.style.display === 'block';
            emojiPicker.style.display = isVisible ? 'none' : 'block';
        };
        
        // Close emoji picker on outside click
        document.onclick = function(e) {
            if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
                emojiPicker.style.display = 'none';
            }
        };
        
        // Emoji tab switching
        document.querySelectorAll('.emoji-tab').forEach(tab => {
            tab.onclick = function() {
                const category = this.dataset.category;
                switchEmojiCategory(category);
            };
        });
        
        console.log('✅ Emoji handlers set with', Object.keys(emojiDatabase).length, 'categories');
    }
    
    // Image upload handler
    const imageBtn = document.getElementById('imageBtn');
    const imageInput = document.getElementById('imageInput');
    
    if (imageBtn && imageInput) {
        imageBtn.onclick = () => imageInput.click();
        imageInput.onchange = handleImageUpload;
        console.log('✅ Image handlers set');
    }
}

// Handle join
function handleJoin() {
    console.log('🎯 Join button clicked');
    
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
    
    console.log('🎯 Joining as:', username);
    
    currentUsername = username;
    isJoined = true;
    
    // Save session
    localStorage.setItem('chatUsername', username);
    localStorage.setItem('chatSessionActive', 'true');
    
    // Join server
    socket.emit('join', { username: username });
    
    // Update UI
    updateUIAfterJoin(username);
    
    // Load existing messages
    loadExistingMessages();
    
    console.log('✅ Successfully joined as:', username);
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
    if (!messageInput) return;
    
    const text = messageInput.value.trim();
    if (!text || !isJoined) return;
    
    console.log('📤 Sending message:', text);
    
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
            console.log('👍 Reacting with:', emoji);
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
        setTimeout(() => {
            if (picker.parentNode) picker.remove();
        }, 5000);
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
    
    if (readBy && readBy.length > 0) {
        // Message read - Blue ticks
        statusIcon.textContent = '✓✓';
        statusIcon.style.color = '#4fc3f7';
        statusText.textContent = 'Read';
        statusElement.className = 'message-status read';
    } else if (status === 'delivered') {
        // Message delivered - Gray double ticks
        statusIcon.textContent = '✓✓';
        statusIcon.style.color = '#9e9e9e';
        statusText.textContent = 'Delivered';
        statusElement.className = 'message-status delivered';
    } else {
        // Message sent - Gray single tick
        statusIcon.textContent = '✓';
        statusIcon.style.color = '#9e9e9e';
        statusText.textContent = 'Sent';
        statusElement.className = 'message-status sent';
    }
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

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Image too large! Maximum size is 5MB.');
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
        console.log('📷 Image sent');
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
}

// Populate emoji picker with all emojis
function populateEmojiPicker() {
    console.log('🎨 Populating emoji picker...');
    
    Object.keys(emojiDatabase).forEach(category => {
        const grid = document.getElementById(`${category}-grid`);
        if (!grid) return;
        
        const emojis = emojiDatabase[category];
        grid.innerHTML = '';
        
        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'emoji-item';
            btn.textContent = emoji;
            btn.onclick = function(e) {
                e.preventDefault();
                insertEmoji(emoji);
            };
            grid.appendChild(btn);
        });
    });
    
    console.log('✅ Emoji picker populated with all emojis!');
}

// Switch emoji category
function switchEmojiCategory(category) {
    // Update tabs
    document.querySelectorAll('.emoji-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.emoji-category').forEach(cat => {
        cat.classList.remove('active');
        if (cat.dataset.category === category) {
            cat.classList.add('active');
        }
    });
}

// Insert emoji into message input
function insertEmoji(emoji) {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.substring(0, cursorPos);
    const textAfter = messageInput.value.substring(cursorPos);
    
    messageInput.value = textBefore + emoji + textAfter;
    messageInput.focus();
    
    // Set cursor position after emoji
    const newPos = cursorPos + emoji.length;
    messageInput.setSelectionRange(newPos, newPos);
    
    console.log('😊 Emoji inserted:', emoji);
}

// Play notification sound - Enhanced version
function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a pleasant notification sound (two-tone)
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // First tone
        oscillator1.frequency.value = 800;
        oscillator1.type = 'sine';
        
        // Second tone (harmony)
        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';
        
        // Volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator1.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.15);
        
        oscillator2.start(audioContext.currentTime + 0.1);
        oscillator2.stop(audioContext.currentTime + 0.4);
        
        console.log('🔔 Notification sound played');
    } catch (e) {
        console.log('🔇 Audio not supported:', e.message);
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

console.log('✅ Complete Working Office Chat loaded - All features ready!');
