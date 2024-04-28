const net = require('net');

// Data to send
const dataToSend = {
    "name": "John Doe",
};

// Create a TCP socket and connect to the server
const client = new net.Socket();
client.connect(3000, 'localhost', () => {
  console.log('Connected to server');
  
  // Send data to the server
  client.write(JSON.stringify(dataToSend));
});

// Handle data received from the server
client.on('data', (data) => {
  console.log('Received data from server:', data.toString());
});

// Handle connection closed
client.on('close', () => {
  console.log('Connection closed');
});
