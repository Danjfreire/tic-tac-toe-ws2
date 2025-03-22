import { WebSocketServer, WebSocket } from 'ws';

const port = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: +port });

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  ws.on('message', (message: string) => {
    console.log('Received:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on port ${port}`); 