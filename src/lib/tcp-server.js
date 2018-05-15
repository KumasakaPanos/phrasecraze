'use strict';

const net = require('net');
const logger = require('./logger');
const faker = require('faker');
const superagent = require('superagent');

const PORT = process.env.PORT;
const path = `:${process.env.HTTP_PORT}`;

let keys = [];
const filledKeys = [];
let gPlayers = [];

const app = net.createServer();
let clients = [];
function Client(socket) {
  this.socket = socket;
  this.nickname = faker.name.firstName();
  this.status = 'user';
  this.playerId = null;
  this.pKeys = [];
} 

const parseCommand = (message, socket) => {
  if (!message.startsWith('@')) {
    return false;
  }
 
  const commandFinder = /@\S*/;
  const command = commandFinder.exec(message);

  const commandVarFinder = /\s.*$/;
  const commandVar = commandVarFinder.exec(message);

  switch (command) {
    case '@write': {
      const dupe = clients.filter(client => client.status === 'admin');
      if (!dupe) {
        const admin = clients.filter(client => client.socket === socket);
        admin.status = 'admin';
        socket.write('You are the admin and have submitted a script');
        const script = {
          content: commandVar,
        };

        superagent.post(`${path}/script`)
          .send(script)
          .then((res) => {
            if (res.status === 200) {
              socket.write('Script submitted successfully \n');

              const players = clients.filter(client => client.socket !== socket);
              let counter = 0;
              players.forEach((player) => {
                player.playerId = counter;
                counter += 1;
              });
                                
              keys = res.body;

              for (let a = 0; a < players.length; a++) {
                for (let i = 0; i < keys.length; i++) {
                  if (keys.length % players.length === a) {
                    players[a].pKeys.push(keys[i].content);
                  }
                }
              }

              gPlayers = players.map(player => player);
              
              players.forEach((player) => {
                player.socket.write(`Here are your template words. Please write your replacements space separated and following an @submit command. \n
                ---> ${player.pKeys}`);
              });
            }
          });
      }
      socket.write('an admin has already been declared-- @write rejected');
      break;
    }

    case '@submit': {
      const parsedResponse = commandVar.split(' ');
      const user = clients.filter(client => (client.socket === socket));
      if (user.status === user) {
        const current = gPlayers.filter(player => player.socket === socket);
        if (current.keys) { 
          for (let i = 0; i < parsedResponse.length; i++) {
            current.keys[i].content = parsedResponse[i];
            filledKeys.push(current.keys[i]);
          }
        }
        socket.write('no keys exist-- @submit rejected');
      }
      socket.write('the admin may not submit words-- @submit rejected');
      break;
    }

    case '@submitAll': {
      const user = clients.filter(client => client.socket === socket);
      if (user.status === 'admin') {
        if (filledKeys.length !== keys.length) {
          superagent.post(`${path}/keys`)
            .send(filledKeys)
            .then((res) => {
              if (res.status === 200) {
                socket.write('Player responses submitted successfully \n');
              }
            });
          socket.write('keys not filled-- @submit rejected');
        }
      }
      socket.write('only admins may submit all-- @submit rejected');
      break;
    }

    case '@pull': {
      const user = clients.filter(client => client.socket === socket);
      if (user.status === 'admin') {
        superagent.get(`${path}/script`)
          .then((res) => {
            if (res.status === 200) {
              socket.write('Final script pulled successfully \n');
            }
            clients.forEach((client) => {
              client.socket.write(res.body);
            });
          });
      }
      break;
    }
      
    default:
      socket.write('That command does not exist!');
      break;
  }
  return true;
};
  
const removeClient = socket => () => {
  clients = clients.filter(client => client.socket !== socket);
  logger.log(logger.INFO, `Removing ${socket.name}`);
};

app.on('connection', (socket) => {
  logger.log(logger.INFO, 'new socket');
  const newClient = new Client(socket);

  clients.push(newClient);
  socket.write('Welcome to the Phrase Craze server!\n');
  socket.write(`Your name is ${newClient.nickname}\n`);

  socket.on('data', (data) => {
    const message = data.toString().trim();

    if (parseCommand(message, socket)) {
      return;
    }

    clients.forEach((client) => {
      if (client.socket !== socket) {
        client.socket.write(`${client.nickname}: ${message}\n`);
      } 
    }); 
  });

  socket.on('close', removeClient(socket));
  socket.on('error', () => {
    logger.log(logger.ERROR, socket.name);
    removeClient(socket)();
  });
});

const server = module.exports = {};

server.start = () => {
  if (!process.env.PORT) {
    logger.log(logger.ERROR, 'missing PORT');
    throw new Error('missing PORT');
  }
  logger.log(logger.INFO, `Server is up on PORT ${process.env.PORT}`);
  return app.listen({ port: process.env.PORT }, () => {});
};

server.stop = () => {
  logger.log(logger.INFO, 'Server is offline');
  return app.close(() => {});
};
