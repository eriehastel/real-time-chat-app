const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://test.alphaprowriters.com", // Adjust to your specific domain
    methods: ["GET", "POST"],
  }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages
  socket.on('chat message', (data) => {
    // Broadcast the message to all users
    io.emit('chat message', data);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
