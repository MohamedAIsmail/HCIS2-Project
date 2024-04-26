// ##############################################################################################################
const net = require('net');

// TCP Connection Part
const TCP_PORT = 3000; // Choose a port number for the TCP server
const tcpServer = net.createServer();

// Handle new connections
tcpServer.on('connection', (socket) => {
  console.log('TCP client connected');

  // Handle data received from client
  socket.on('data', (data) => {
    console.log('Data received from TCP client:', data.toString());
    // Process the data received from the TCP client
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('TCP client disconnected');
  });
});

// Start listening on the TCP_PORT
tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP Server is running on port ${TCP_PORT}`);
});