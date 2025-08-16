import express from 'express';
import router from './router.js';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import http from 'http';

const app = express();
const port = 3010;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(router);

// Create raw HTTP server
const server = http.createServer(app);

// Create WS server in noServer mode
const wss = new WebSocketServer({ noServer: true });

// Handle WS upgrade manually
server.on('upgrade', (req, socket, head) => {

  if (req.url !== '/socket') {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
  });
  ws.send('Connected to WebSocket!');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});