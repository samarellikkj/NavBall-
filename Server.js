// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let players = [];

wss.on('connection', (ws) => {
  console.log('Novo jogador conectado');

  const player = { id: Date.now(), ws };
  players.push(player);

  broadcast({ type: 'players', players: players.map(p => p.id) });

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    if (data.type === 'move') {
      broadcast({ type: 'move', playerId: player.id, x: data.x, y: data.y });
    }
  });

  ws.on('close', () => {
    players = players.filter(p => p !== player);
    broadcast({ type: 'players', players: players.map(p => p.id) });
  });
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  players.forEach(p => p.ws.send(msg));
}

console.log('Servidor WebSocket rodando na porta 3000');
