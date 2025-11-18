// Client-side JavaScript for no-db-office-chat
// Handles Socket.IO connection, message sending/receiving, and UI updates

let socket;
let currentUsername = null;
let isJoined = false;
let notificationPermission = false;

// DOM elements
const usernameInput = document.getElementById('usernameInput');
const joinBtn = document.getElementById('joinBtn');
const joinSection = document.getElementById('joinSection');
const userInfo = document.getElementById('userInfo');
const currentUsernameSpan = document.getElementById('currentUsername');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const statusText = document.getElementById('statusText');
const connectionStatus = document.getElementById('connectionStatus');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');
const imageBtn = document.getElementById('imageBtn');
const imageInput = document.getElementById('imageInput');

// Comprehensive emoji database
const emojiDatabase = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'],
    gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    food: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧈', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈', '🍞', '🥐', '🥨', '🥯', '🥖', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🫔', '🥫', '🍖', '🍗', '🥩', '🍠', '🥟', '🥠', '🥡', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊', '🚴', '🚵', '🧗', '🤹', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🕋'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪒', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🖼️', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧', '🔥', '💧', '🌊', '🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🎀', '🎁', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🪄', '🧿', '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🪅', '🪆', '♟️', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢']
};

// Quick reactions for messages (Instagram style)
const quickReactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '🔥'];

// Notification sound (using Web Audio API)
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

// Request notification permission
async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        notificationPermission = permission === 'granted';
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

// Initialize Socket.IO connection
function initSocket() {
    console.log('Initializing Socket.IO connection...');

    socket = io({
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
        transports: ['websocket', 'polling']
    });

    // Make socket globally available
    window.socket = socket;

    // Connection established
    socket.on('connect', () => {
        console.log('✅ Connected to server! Socket ID:', socket.id);
        updateConnectionStatus(true);

        // Re-join if already joined before
        if (isJoined && currentUsername) {
            console.log('Re-joining as:', currentUsername);
            socket.emit('join', { username: currentUsername });
        }
    });

    // Connection lost
    socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from server. Reason:', reason);
        updateConnectionStatus(false);
    });

    // Connection error
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });

    // Receive chat messages
    socket.on('chatMessage', (message) => {
        console.log('📨 Received message:', message);
        displayMessage(message);

        // Play sound and show notification for other users' messages
        if (message.type === 'user' && message.user !== currentUsername) {
            try {
                playNotificationSound();
                showNotification(`New message from ${message.user}`, message.text);
            } catch (e) {
                console.log('Notification error:', e);
            }
        } else if (message.type === 'system') {
            try {
                playNotificationSound();
            } catch (e) {
                console.log('Sound error:', e);
            }
        }
    });

    // Receive users list updates
    socket.on('usersList', (users) => {
        console.log('👥 Online users:', users);
        updateUsersList(users);
    });

    // Receive reaction updates
    socket.on('reactionUpdate', (data) => {
        console.log('Reaction update:', data);
        displayReactions(data.messageId, data.reactions);
    });
}

// Update connection status indicator
function updateConnectionStatus(connected) {
    const statusDot = connectionStatus.querySelector('.status-dot');
    if (connected) {
        statusText.textContent = 'Connected';
        statusDot.classList.add('connected');
    } else {
        statusText.textContent = 'Disconnected';
        statusDot.classList.remove('connected');
    }
}

// Load existing messages from server
async function loadMessages() {
    try {
        const response = await fetch('/messages');
        const messages = await response.json();

        // Clear welcome message
        messagesList.innerHTML = '';

        // Display all messages
        messages.forEach(message => displayMessage(message, false));

        // Scroll to bottom
        scrollToBottom();
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Display a message in the chat
function displayMessage(message, shouldScroll = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    messageDiv.dataset.messageId = message.id;

    if (message.type === 'system') {
        // System message (join/leave notifications)
        messageDiv.classList.add('system-message');
        messageDiv.innerHTML = `
      <div class="message-content">${escapeHtml(message.text)}</div>
    `;
    } else if (message.type === 'image') {
        // Image message
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
        // User message
        const isCurrentUser = message.user === currentUsername;
        messageDiv.classList.add(isCurrentUser ? 'user-message' : 'other-message');

        const time = formatTime(message.time);

        messageDiv.innerHTML = `
      <div class="message-header">
        <span class="message-user">${escapeHtml(message.user)}</span>
        <span class="message-time">${time}</span>
      </div>
      <div class="message-content">${escapeHtml(message.text)}</div>
      <div class="message-reactions" id="reactions-${message.id}"></div>
    `;
    }

    messagesList.appendChild(messageDiv);

    // Animate message appearance
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);

    if (shouldScroll) {
        scrollToBottom();
    }
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format timestamp for display
function formatTime(isoString) {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Scroll chat to bottom
function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    container.scrollTop = container.scrollHeight;
}

// Handle join button click
joinBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();

    if (!username) {
        alert('Please enter your name');
        return;
    }

    if (username.length > 30) {
        alert('Name is too long (max 30 characters)');
        return;
    }

    // Join the chat
    currentUsername = username;
    isJoined = true;

    // Request notification permission
    requestNotificationPermission();

    // Emit join event to server
    socket.emit('join', { username });

    // Update UI
    joinSection.style.display = 'none';
    userInfo.style.display = 'block';
    currentUsernameSpan.textContent = username;
    messageInput.disabled = false;
    sendBtn.disabled = false;
    emojiBtn.disabled = false;
    imageBtn.disabled = false;
    messageInput.focus();

    // Load existing messages
    loadMessages();

    console.log('Joined chat as:', username);
});

// Handle send button click
sendBtn.addEventListener('click', sendMessage);

// Handle Enter key in message input
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form submission
        sendMessage();
    }
});

// Send a message
function sendMessage() {
    const text = messageInput.value.trim();

    if (!text) {
        return;
    }

    if (!isJoined) {
        alert('Please join the chat first');
        return;
    }

    console.log('Sending message:', text);

    // Emit message to server
    socket.emit('chatMessage', { text });

    // Clear input
    messageInput.value = '';
    messageInput.focus();
}

// Handle Enter key in username input
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinBtn.click();
    }
});

// Emoji picker toggle
emojiBtn.addEventListener('click', () => {
    const isVisible = emojiPicker.style.display === 'block';
    emojiPicker.style.display = isVisible ? 'none' : 'block';
});

// Emoji selection
document.querySelectorAll('.emoji-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const emoji = btn.textContent;
        messageInput.value += emoji;
        messageInput.focus();
        emojiPicker.style.display = 'none';
    });
});

// Close emoji picker when clicking outside
document.addEventListener('click', (e) => {
    if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
        emojiPicker.style.display = 'none';
    }
});

// Image upload button
imageBtn.addEventListener('click', () => {
    imageInput.click();
});

// Handle image selection
imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image too large! Maximum size is 5MB.');
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
        const imageData = event.target.result;

        // Send image message
        socket.emit('chatMessage', {
            type: 'image',
            image: imageData,
            text: '' // Optional caption
        });

        console.log('Image sent');
    };
    reader.readAsDataURL(file);

    // Reset input
    imageInput.value = '';
});

// Initialize emoji picker with all emojis
function initEmojiPicker() {
    Object.keys(emojiDatabase).forEach(category => {
        const grid = document.getElementById(`${category}-grid`);
        if (grid) {
            emojiDatabase[category].forEach(emoji => {
                const btn = document.createElement('button');
                btn.className = 'emoji-item';
                btn.textContent = emoji;
                btn.onclick = () => {
                    messageInput.value += emoji;
                    messageInput.focus();
                };
                grid.appendChild(btn);
            });
        }
    });
}

// Emoji tab switching
document.querySelectorAll('.emoji-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.dataset.category;

        // Update active tab
        document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active category
        document.querySelectorAll('.emoji-category').forEach(c => c.classList.remove('active'));
        document.querySelector(`.emoji-category[data-category="${category}"]`).classList.add('active');
    });
});

// Add reaction to message
function addReaction(messageId, emoji) {
    if (!isJoined) return;

    console.log('Adding reaction:', emoji, 'to message:', messageId);
    socket.emit('messageReaction', {
        messageId: messageId,
        emoji: emoji,
        username: currentUsername
    });
}

// Display reactions on message
function displayReactions(messageId, reactions) {
    const reactionsContainer = document.getElementById(`reactions-${messageId}`);
    if (!reactionsContainer) return;

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

    // Add "+" button for more reactions
    const addBtn = document.createElement('button');
    addBtn.className = 'add-reaction-btn';
    addBtn.innerHTML = '+';
    addBtn.title = 'Add reaction';
    addBtn.onclick = (e) => showQuickReactions(e, messageId);
    reactionsContainer.appendChild(addBtn);
}

// Show quick reactions picker
function showQuickReactions(event, messageId) {
    event.stopPropagation();

    // Remove existing picker
    const existing = document.querySelector('.reaction-picker');
    if (existing) existing.remove();

    // Create picker
    const picker = document.createElement('div');
    picker.className = 'reaction-picker';
    picker.style.position = 'fixed';
    picker.style.left = event.clientX + 'px';
    picker.style.top = (event.clientY - 50) + 'px';

    quickReactions.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-item';
        btn.textContent = emoji;
        btn.onclick = () => {
            addReaction(messageId, emoji);
            picker.remove();
        };
        picker.appendChild(btn);
    });

    document.body.appendChild(picker);

    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', function closePickerHandler() {
            picker.remove();
            document.removeEventListener('click', closePickerHandler);
        });
    }, 100);
}

// Update online users list
function updateUsersList(users) {
    const usersList = document.getElementById('usersList');
    const userCount = document.getElementById('userCount');

    userCount.textContent = users.length;

    if (users.length === 0) {
        usersList.innerHTML = '<p class="no-users">No users online</p>';
        return;
    }

    usersList.innerHTML = '';

    users.forEach(username => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';

        // Get first letter for avatar
        const initial = username.charAt(0).toUpperCase();

        // Check if it's current user
        const isCurrentUser = username === currentUsername;

        userItem.innerHTML = `
            <div class="user-avatar">${initial}</div>
            <div class="user-name">${escapeHtml(username)}${isCurrentUser ? ' (You)' : ''}</div>
            <div class="user-status"></div>
        `;

        usersList.appendChild(userItem);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== Office Chat Initialized ===');
    console.log('Page loaded, socket will be initialized by app-fix.js');

    // Initialize emoji picker if needed
    if (typeof initEmojiPicker === 'function') {
        initEmojiPicker();
    }

    // Focus username input
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) {
        usernameInput.focus();
    }
});