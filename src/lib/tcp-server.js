'use strict';

const net = require('net');
const logger = require('./logger');
const faker = require('faker');
const superagent = require('superagent');

const path = `http://localhost:${process.env.HTTP_PORT}`;

let keys = [];
const filledKeys = [];
const script = {};
let finScript = '';

let clients = [];
let players = [];

const app = net.createServer();

function Client(socket) {
  this.socket = socket;
  this.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
  this.status = 'user';
  this.id = faker.random.uuid();
  this.pKeys = [];
  this.words = [];
} 

const parseCommand = (message, user) => {
  if (!message.startsWith('@')) {
    return false;
  }
 
  const commandFinder = /@\S*/;
  const command = commandFinder.exec(message);

  const commandVarFinder = /\s.*$/;
  const commandVar = commandVarFinder.exec(message);

  switch (command[0]) {
    case '@admin': {
      const dupes = clients.filter(client => client.status === 'admin');
      if (dupes.length < 1) {
        user.status = 'admin';
        user.socket.write('You have been declared the admin \n');
      } else user.socket.write('An admin has already been declared-- @admin rejected \n');
      break;
    }

    case '@notadmin': {
      if (user.status === 'admin') {
        user.status = 'user';
        user.socket.write('You are no longer the admin \n');
      }
      break;
    }

    case '@title': {
      if (user.status === 'admin') {
        if (commandVar[0]) {
          script.title = commandVar[0]; //eslint-disable-line
          console.log(script);
        }
      } else user.socket.write('Only admins can set title-- @title rejected \n');
      break;
    }

    case '@write': {
      if (user.status === 'admin') {
        players = clients.filter(client => client.status !== 'admin');

        if (commandVar[0]) {
          script.content = commandVar[0]; //eslint-disable-line
          console.log(script);          
        }
        user.socket.write('You have submitted a script \n');
        return superagent.post(`${path}/script`)
          .send(script)
          .then((res) => {
            if (res.status === 200) {
              user.socket.write('Script submitted successfully \n');
           
              keys = res.body;
              console.log(keys);

              console.log('players', players);

              let counter = 0;
              for (let i = 0; i < players.length; i++) {
                // console.log('keys to be pushed', keys.keywordsArray[i].content);
                players[i].pKeys.push(keys.keywordsArray[counter]);
                console.log('keywords for each player', players[i].pKeys);

                counter += 1;
                if (counter === keys.keywordsArray.length) {
                  console.log('length of Keywords', keys.keywordsArray.length);
                  i = Infinity;

                }
                if (i === players.length - 1) {
                  i = -1;
                }
              }
              players.forEach((player) => {
                for (let i = 0; i < player.pKeys.length; i++) {
                  player.words.push(player.pKeys[i].content);
                }
              });
              console.log('players', players);
              players.forEach((player) => {
                console.log('words for players', player.words);
                player.socket.write(`Here are your template words. \n Please write your replacements space separated and following an @submit command. \n
                ---> ${player.words} `);  
              });
            }
          })
          .catch(error => new Error(error));
      }
      user.socket.write('Only admins may write scripts-- @write rejected');
      break;
    }

    case '@mywords': {
      players.forEach((player) => {
        if (player.id === user.id) {
          user.socket.write(`${player.words}`);
        }
      });
      break;
    }

    case '@submit': {
      const parsedResponse = commandVar[0].trim().split(' ');
      const current = players.filter(player => player.id === user.id);
      console.log('current', current);
      console.log('parsed response', parsedResponse);
      if (current[0].words.length === parsedResponse.length) {
        for (let i = 0; i < current[0].pKeys.length; i++) {          
          current[0].pKeys[i].content = parsedResponse[i];
          filledKeys.push(current[0].pKeys[i]);
          console.log('filled keys array', filledKeys);
        }
      } else {
        user.socket.write('Number of words entered is incorrect. \n Use @mywords to see your words again. \n');
      }
      break;
    }

    case '@submitAll': {
      if (user.status === 'admin') {
        console.log('Before override keys', keys);
        if (filledKeys.length === keys.keywordsArray.length) {
          for (let i = 0; i < keys.keywordsArray.length; i++) {
            keys.keywordsArray[i] = filledKeys[i];
          }
          console.log('override keys', keys);
          superagent.put(`${path}/keys`)
            .send(keys)
            .then((res) => {
              if (res.status === 200) {
                finScript = res.body;
                user.socket.write('Final script pulled successfully \n');
              }
              clients.forEach((client) => {
                client.socket.write(finScript);
              });
            });
        } else { 
          user.socket.write('keys not filled-- @submit rejected \n'); 
        }
      } else {
        user.socket.write('only admins may submit all-- @submit rejected \n');
      }
      break;
    }
      
    default:
      user.socket.write('That command does not exist! \n');
      break;
  }
  return true;
};

const removeClient = user => () => {
  clients = clients.filter(client => client.id !== user.id);
  players = players.filter(player => player.id !== user.id);
  clients.forEach(client => client.socket.write(`${user.name} has left the room.`));
};

app.on('connection', (socket) => {
  const user = new Client(socket);
  
  clients.push(user);
  user.socket.write('Welcome to the Phrase Craze server!\n');
  user.socket.write(`Your name is ${user.name}\n`);
  
  socket.on('data', (data) => {
    const message = data.toString().trim();

    if (parseCommand(message, user)) {
      return;
    }
    
    clients.forEach((client) => {
      if (client.id !== user.id) {
        client.socket.write(`${user.name}: ${message}\n`);
      }
    }); 
  });

  socket.on('close', removeClient(user));
  socket.on('error', () => {
    logger.log(logger.ERROR, socket.name);
    removeClient(socket)();
  });
});


const server = module.exports = {};

server.start = () => {
  if (!process.env.TCP_PORT) {
    logger.log(logger.ERROR, 'missing TCP PORT');
    throw new Error('missing TCP PORT');
  }
  logger.log(logger.INFO, `Server is up on PORT ${process.env.TCP_PORT}`);
  return app.listen({ port: process.env.TCP_PORT }, () => {});
};

server.stop = () => {
  logger.log(logger.INFO, 'Server is offline');
  return app.close(() => {});
};
