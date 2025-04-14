/**
 * Y-Websocket Server for Multi-User Collaboration
 * 
 * This is a simple WebSocket server that can be run alongside the app to enable
 * multi-user collaboration through Yjs.
 * 
 * Usage:
 * - node collaboration-server.js
 * - Default port is 1234, can be changed with PORT environment variable
 */
const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const PORT = process.env.PORT || 1234;

// Create a simple HTTP server
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Y-Websocket Server Running');
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
  // The room name is the name of the document that is being edited
  // This can be extracted from the URL: /taskManager/roomName
  const roomName = req.url.slice(1).split('/')[1] || 'default-room';
  
  // Set up the connection with Yjs
  setupWSConnection(conn, req, { 
    // You can add authentication here
    gc: true, // Enable garbage collection
    pingTimeout: 30000,
    docName: roomName
  });
  
  console.log(`New connection established for room: ${roomName}`);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Y-Websocket Server running on port ${PORT}`);
  console.log(`Connect clients to ws://localhost:${PORT}/taskManager/[room-name]`);
});