const net = require('net');

// const dataToSend = {
//   "scenario": "createAppointment",
//   "id": "662d6f90e1746ef10b8ccc11",
//   "hl7Message": "MSH|^~\\&|SendingApp|SendingFac|ReceivingApp|ReceivingFac|20240424120000||ADT^A04|123456|T|2.3.1|||AL|NE||||\rARQ|A04||||||EMERGENCY||00:30||2028-09-30T11:55|ASAP|1^WEEK|1^HOUR|Magdy^Nasr|01148800070|\rAIS|1234|||11:50||||||"
// }

const dataToSend = {
  "scenario": "registerPatient",
  "hl7Message": "MSH|^~\\&|SendingApp|SendingFac|ReceivingApp|ReceivingFac|20240424120000||ADT^A04|123456|T|2.3.1|||AL|NE||||\rEVN|A04|20240424120000||||\rPID|1|123456||654321|Doe^John^Smith||197001010000|F|Doe^Jane^Smith||White|123 Main St^^New York^NY^12345^US^H|200||||||987987798|987654||123456789|987654321||C|199001010000|Y|||\rPV1|1|O|Consulting|PRT^Practitioner^Role^Title|^^^^^Phone^FacilityID||||||||||||||||||||||||||||||||"
}

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

  // Close the connection after receiving the response
  // client.end();
});

// Handle connection closed
client.on('close', () => {
  console.log('Connection closed');
});
