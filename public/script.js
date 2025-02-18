const socket = io(); 

let username = ''; //  user's email or name
let replyingToMessage = null; // Store the message being replied to

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-btn');
const startChatButton = document.getElementById('start-chat');
const usernameInput = document.getElementById('username');
const chatContainer = document.getElementById('chat-container');
const replyBox = document.getElementById('reply-box'); 

// Start chat when the username is entered
startChatButton.addEventListener('click', () => {
  if (usernameInput.value.trim() !== '') {
    username = usernameInput.value.trim();
    document.querySelector('h1').textContent = `Welcome, ${username}!`;
    usernameInput.parentElement.style.display = 'none'; // Hide username prompt
    chatContainer.style.display = 'block'; // Show chat UI
  }
});

// Send message when clicking the send button
sendButton.addEventListener('click', sendMessage);

// Send message on 'Enter' keypress
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && messageInput.value.trim() !== '') {
    sendMessage();
  }
});

function sendMessage() {
  if (messageInput.value.trim() !== '' && username !== '') {
    const msg = {
      user: username,
      text: messageInput.value,
      timestamp: new Date().toLocaleTimeString(),
      replyTo: replyingToMessage, // Include the quoted message if any
    };
    socket.emit('chat message', msg);
    messageInput.value = ''; 
    replyingToMessage = null; 
    replyBox.innerHTML = ''; 
  }
}

// Function to handle replying to a specific message
function replyToMessage(messageText) {
  replyingToMessage = messageText;
  replyBox.innerHTML = `Replying to: "${messageText}" <button onclick="cancelReply()">Cancel</button>`;
}

function cancelReply() {
  replyingToMessage = null;
  replyBox.innerHTML = '';
}

// Receive and display new messages
socket.on('chat message', (msg) => {
  const newMessage = document.createElement('div');
  newMessage.classList.add('chat-message');

  // Add sender's name
  const senderName = document.createElement('div');
  senderName.classList.add('chat-sender');
  senderName.textContent = msg.user;

  // Add quoted message if there is a reply
  if (msg.replyTo) {
    const quotedMessage = document.createElement('div');
    quotedMessage.classList.add('quoted-message');
    quotedMessage.textContent = `Replying to: "${msg.replyTo}"`;
    newMessage.appendChild(quotedMessage);
  }

  // Add message text
  const messageText = document.createElement('div');
  messageText.classList.add('chat-text');
  messageText.textContent = msg.text;

  // Add timestamp
  const timestamp = document.createElement('div');
  timestamp.classList.add('chat-timestamp');
  timestamp.textContent = msg.timestamp;

  // Add a reply button
  const replyButton = document.createElement('button');
  replyButton.classList.add('reply-btn');
  replyButton.textContent = 'Reply';
  replyButton.onclick = () => replyToMessage(msg.text);

  // Append elements
  newMessage.appendChild(senderName);
  newMessage.appendChild(messageText);
  newMessage.appendChild(timestamp);
  newMessage.appendChild(replyButton);

  // Check if the message is from the current user
  if (msg.user === username) {
    newMessage.classList.add('sent-message'); 
    newMessage.classList.add('received-message'); 
  }

  chatBox.appendChild(newMessage);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
});
