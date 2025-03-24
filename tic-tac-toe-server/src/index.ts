import { WebSocketServer, WebSocket } from 'ws';
import { GameServer } from './game/game-server';

const port = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: +port });
const gameServer = new GameServer();

wss.on('connection', (socket) => {
  gameServer.handleConnection(socket);
});

console.log(`WebSocket server is running on port ${port}`); 
