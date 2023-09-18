import {  Socket, io } from 'socket.io-client';

export enum MessageType {
  'plain-text',
  'json',
  'rich-text',
  'packed',
  'broadcast',
  'ACK',
  'unknown',
  'e2ee',
  'key-exchange',
  'withdraw',
}

enum ACKMsgType {
  'DELIVERED',
  'RECEIVED',
  'READ',
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

  socket.emit('message', {
    senderId: 2,
    receiverId: 1,
    content: {
      ackMsgId: message.msgId,
      type: ACKMsgType.RECEIVED, // received
    },
    type: MessageType.ACK,
  })

  //wait for 3 seconds
  setTimeout(() => {
    socket.emit('message', {
      senderId: 2,
      receiverId: 1,
      content: {
        ackMsgId: message.msgId,
        type: ACKMsgType.READ, // received
      },
      type: MessageType.ACK,
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
