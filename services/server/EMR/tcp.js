const express = require('express');
const net = require('net');

// Create an Express app
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

// Create a TCP server
const tcpServer = net.createServer(socket => {
  socket.write('Hello from TCP server!\r\n');
  socket.end();
});

const TCP_PORT = 4000;

// Start TCP server
tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
