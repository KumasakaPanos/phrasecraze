'use strict';

import faker from 'faker';
import server from '../lib/tcp-server';
import net from 'net';

const PORT = process.env.TCP_PORT;
jest.mock('../lib/tcp-server');


beforeAll(server.start);
afterAll(server.stop);

describe('Test - git the server works', () => {
  test('TCP server should listen on PORT 3000', () => {
    expect(PORT).toEqual('3000');
  });
});

describe('Test - TCP server should start and run on PORT 3000', () => {
  test('TCP server is on PORT 3000', () => {
    server.stop;
    server.start;
    // console.log(server, 'this is the server function');
    expect(PORT).toEqual('3000');
  });
});


describe('Test - socket.write messages should return a string data type', () => {
  const message = [];
  const client = net.connect({ port: 3000 });
  client.on('data', (data) => {
    console.log(data.toString(), 'tcp data tester');
    message.push(data.toString());
    client.end(null, () => {
      if (message.includes(data.toString())) {
        var testExpect = true;
      } else {
        testExpect = false;
      }
      expect(testExpect).toBe(true);
      done();
    });
  });
});

describe('Test - socket.write functionality', () => {
  test('TCP socket.write should respond with a socket.name and a socket.user and the data should return a Welcome message,', () => {
    const socket = net.connect(3000, 'localhost');
    socket.user = 'phraseCraze';
    socket.name = 'Tim';
    socket.write('Welcome to the Phrase Craze server!\n');
    // socket.write(`Your name is ${user.name}\n`);
    // console.log(socket, 'this is the socket');
    expect(socket.user).toMatch('phraseCraze');
    expect(socket.name).toMatch('Tim');
    expect(socket._pendingData).toMatch('Welcome to the Phrase Craze server!\n');
  });
});

describe('Test - @commands for the correct string output', () => {
  test('@admin command should return "You have been declared the admin"', () => {
    const socket = net.connect(3000, 'localhost');
    socket.on('data', (data) => {
      console.log('data on connection', data.toString());
    });
    socket.write('@admin', () => {
      socket.on('data', (data) => {
        console.log('DATA @admin ', data.toString());
        expect(data.toString()).toMatch('You have been declared the admin \n');
      });
    });
  });
  test('@notadmin command should return "You are no longer the admin \n"', () => {
    const socket = net.connect(3000, 'localhost');
    socket.on('data', (data) => {
      console.log('data on connection', data.toString());
    });
    socket.write('@notadmin', () => {
      socket.on('data', (data) => {
        console.log('DATA @admin ', data.toString());
        expect(data.toString()).toMatch('You are no longer the admin \n');
      });
    });
  });
});

describe('Test - switch statement commands', () => {
  const mockParseCommand = (message, user) => {
    if (!message.startsWith('@')) {
      return false;
    }

    const mockCommandFinder = /@\S*/;
    const mockCommand = mockCommandFinder.exec(message);

    const mockCommandVarFinder = /\s.*$/;
    const mockCommandVar = mockCommandVarFinder.exec(message);

    switch (command[0]) {
      case '@admin': {
        const dupes = clients.filter(client => client.status === 'admin');
        if (dupes.length < 1) {
          user.status = 'admin';
          user.socket.write('You have been declared the admin \n');
        } else user.socket.write('An admin has already been declared-- @admin rejected \n');
        break;
      }
        if (user.status = 'admin') {
          expect(user.socket.write).toEqual('You have been declared the admin \n');
        }
    }
  };
});
