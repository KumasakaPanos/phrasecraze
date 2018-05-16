'use strict';

import faker from 'faker';
import server from '../lib/tcp-server';
import net from 'net';
const PORT = process.env.TCP_PORT;

function ClientMock(socket) {
  this.socket = socket;
  this.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
  this.status = 'user';
  this.id = faker.random.uuid();
  this.pKeys = [];
  this.words = [];
}

beforeAll(server.start);
afterAll(server.stop);

describe('does the server work?', () => {
  test('TCP server should listen on PORT 3000', () => {
    expect(PORT).toEqual('3000');
  });
});

describe('socket.write messages', () => {
  let message = [];
  const client = net.connect({ port: 3000 });
  client.on('data', data => {
    console.log(data.toString(), 'tcp data tester');
    message.push(data.toString());
    client.end(null, () => {
      if(message.includes(data.toString())){
        var testExpect = true;
      } else {
        testExpect = false;
      }
      expect(testExpect).toBe(true);
      done();
    });
  });
});

describe('testing socket.write', () => {
  test('should respond with a socket name,', () => {
    let socket = net.connect(3000, 'localhost');
    socket.user = 'phraseCraze'
    socket.name = 'Tim';
    socket.write('Welcome to the Phrase Craze server!\n');
    // socket.write(`Your name is ${user.name}\n`);
    console.log(socket, 'this is the socket');
    expect(socket.user).toMatch('phraseCraze');
    expect(socket.name).toMatch('Tim');
  });
});

// describe('parseCommand message', () => {
//   test('if the message does not begin with @ then return false', () => {
//     const  = ;
//   });
// });