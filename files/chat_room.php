<?php 
session_start();

// Check if the user is logged in, if not redirect to login page
if (!isset($_SESSION['login_name'])) {
    header("Location: login.php"); // Redirect to login if not logged in
    exit;
}

$user_name = $_SESSION['login_name'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Real-Time Chat</title>
  <style>
    #chat-box {
      width: 100%;
      height: 300px;
      overflow-y: scroll;
      border: 1px solid #ccc;
      padding: 10px;
      background-color: #f9f9f9;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      gap: 15px; /* Add spacing between messages */
    }
  
    .chat-message {
      max-width: 60%;
      padding: 8px 12px;
      border-radius: 12px;
      display: inline-block;
      word-wrap: break-word;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    }
  
    .chat-sender {
      font-size: 0.75em;
      font-weight: bold;
      margin-bottom: 5px;
    }
  
    .chat-text {
      font-size: 1em;
      margin: 5px 0;
    }
  
    .chat-timestamp {
      font-size: 0.7em;
      color: #666;
      margin-top: 5px;
      text-align: right;
    }
  
    /* Sent messages (right-aligned) */
    .sent-message {
      background-color: #d1ffd1;
      align-self: flex-end;
      text-align: left; /* Text remains left-aligned for readability */
      border-top-right-radius: 0px; /* Styling tweak */
    }
  
    /* Received messages (left-aligned) */
    .received-message {
      background-color: #e5e5e5;
      align-self: flex-start;
      text-align: left;
      border-top-left-radius: 0px; /* Styling tweak */
    }
  </style>
</head>
<body>
  <h1>Welcome to the Chat Room, <?php echo $user_name; ?>!</h1>

  <!-- Chat UI -->
  <div id="chat-container">
    <div id="chat-box"></div>
    <div id="reply-box" style="padding: 5px; font-size: 0.9em; font-style: italic;"></div>

    <input type="text" id="message" placeholder="Type a message..." autocomplete="off" />
    <button id="send-btn">Send</button>
  </div>

  <!-- Socket.IO Script -->
  <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>
  <script>
    const userName = "<?php echo $user_name; ?>"; // Get the username from PHP session
    const socket = io(); // Initialize the Socket.IO connection

    // Function to append messages to the chat box
    function appendMessage(sender, message, timestamp) {
      const messageContainer = document.createElement('div');
      messageContainer.classList.add(sender === userName ? 'sent-message' : 'received-message');
      
      messageContainer.innerHTML = `
        <p class="chat-sender">${sender}</p>
        <p class="chat-text">${message}</p>
        <span class="chat-timestamp">${timestamp}</span>
      `;

      document.getElementById('chat-box').appendChild(messageContainer);
      document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight; // Auto scroll
    }

    // Send message when the "Send" button is clicked
    document.getElementById('send-btn').addEventListener('click', () => {
      const message = document.getElementById('message').value.trim();
      if (message) {
        const timestamp = new Date().toLocaleTimeString(); // Get the current time
        appendMessage(userName, message, timestamp); // Display the message locally
        socket.emit('chat message', { sender: userName, message, timestamp }); // Emit message to the server

        document.getElementById('message').value = ''; // Clear the input box
      }
    });

    // Receive messages from the server
    socket.on('chat message', (data) => {
      appendMessage(data.sender, data.message, data.timestamp);
    });
  </script>
</body>
</html>
