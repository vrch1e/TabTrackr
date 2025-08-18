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

wss.on('connection', (ws) => { // When there's a websocket connection with the client:
  ws.on('message', (data) => { // 'data' is the tab usage object.
    let parsed = JSON.parse(data)
    console.log('Received:', parsed);
    
    if (parsed.type === 'usage') {
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsed));
        }
      });
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});
