import {  Socket, io } from 'socket.io-client';

enum ACKMessageType {
  SERVER_RECEIVED,   //服务器已接收
  DELEVERED,  //已送达但未读
  READ,       //已读
}
const socket = io('http://127.0.0.1:3001', {
  port: 3001,
  extraHeaders: {
    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ1c2VyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2OTM2NDM4MjUsImV4cCI6MTY5NjIzNTgyNX0.06GcsLzucY1ZnreidSDjmu-AwRRJzB1OjGPkZxfsL0A',
  },
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('successfully connected to server!');
});

socket.on('message', (message) => {
  console.log('Received message:', message);

  socket.emit('ack', {
    "msgId":  message.msgId + 1000,
    "senderId":2,
    "receiverId":1,
    "content":"123",
    "type": ACKMessageType.DELEVERED,
    "ackMsgId": message.msgId
  })

  //wait for 3 seconds
  setTimeout(() => {
    socket.emit('ack', {
      "msgId": message.msgId + 1001,
      "senderId":2,
      "receiverId":1,
      "content":"123",
      "type": ACKMessageType.READ, // read
      "ackMsgId": message.msgId
    })
  }, 3000)

})

socket.on('ack', (ackMessage) => {
  console.log('Received acknowledgment:', ackMessage);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  console.log('retrying...');
});

console.log('Connecting to server...');

try {
  socket.connect()
} catch (error) {
  console.error(error)
}
