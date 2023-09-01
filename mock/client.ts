import {  Socket, io } from 'socket.io-client';

enum ACKMessageType {
  SERVER_RECEIVED,   //服务器已接收
  DELEVERED,  //已送达但未读
  READ,       //已读
}
const socket = io('http://127.0.0.1:3001', {
  port: 3001,
  extraHeaders: {
    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ1c2VyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2OTM1NDkwNDksImV4cCI6MTY5MzYzNTQ0OX0.ur1wm0RqxTLBt7Oqg_XMP6LL0aVHn1Dr-M9fyprj9K4',
  },
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('successfully connected to server!');
});

socket.on('message', (message) => {
  console.log('Received message:', message);

  socket.emit('ack', {
    "msgId": message.msgId + 1000,
    "senderId":2,
    "receiverId":1,
    "content":"123",
    "type": ACKMessageType.DELEVERED,
    "ackMsgId": message.msgId
  })

  //wait for 3 seconds
  setTimeout(() => {
    socket.emit('ack', {
      "msgId": message.msgId + 1000,
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
  console.error('Connection error:', error);
});

console.log('Connecting to server...');
try {
  socket.connect();
  console.log('is connected', socket.connected);
} catch (error) {
  console.error(error);
}
console.log('Connected to server');
