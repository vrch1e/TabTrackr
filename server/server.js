import express from 'express';
import router from './router.js';
import { saveVisits } from './controller/service.js'
import { WebSocketServer } from 'ws';
import cors from 'cors';
import http from 'http';
import path from 'node:path';
import { fileURLToPath } from 'node:url'

const app = express();
const port = 3010;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '../webapp-client/dist')
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(router);
app.use(express.static(clientDist))

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

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

    if (parsed['usage']) {
      let usageDataToLog = {'usage': []}
      console.log('parsed usage: ', parsed['usage'])
      for(const site in parsed['usage']) {
        if (parsed['usage'][site]['url'] != 'about:blank') { // makes sure we don't log a chrome popup that was in focus
          let siteData = {'site': parsed['usage'][site]['site'], 'url': parsed['usage'][site]['url'], 'timespent': parsed['usage'][site]['timespent'], 'userId': parsed['userId']}
          usageDataToLog['usage'].push(siteData)
        }
      }
       
      saveVisits(usageDataToLog); // log session usage data to db

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
