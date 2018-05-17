'use strict';

// const faker = ('faker');
import server from '../lib/tcp-server';

const net = ('net');
const PORT = process.env.TCP_PORT;
// jest.mock('../lib/tcp-server');

beforeAll(server.start);
afterAll(server.stop);

describe('Test - TCP server should start and run on PORT 3000', () => {
  test('TCP server should listen on PORT 3000', () => {
    expect(PORT).toEqual('5000');
  });
});

describe('Test - socket.write messages should return a string data type', () => {
  const message = [];
  const client = net.connect({ port: 5000 });
  client.on('data', (data) => {
    console.log(data.toString(), 'tcp data tester');
    message.push(data.toString());
    client.end(null, () => {
      let testExpect = false;
      if (message.includes(data.toString())) {
        testExpect = true;
      } else {
        testExpect = false;
      }
      expect(testExpect).toBe(true);
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
    console.log(socket, 'this is the socket');
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

  test('@write command should "You are no longer the admin \n"', () => {
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

    switch (mockCommand[0]) {
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
        if (user.status !== 'admin') {
          expect(user.socket.write).toEqual('An admin has already been declared-- @admin rejected \n');
        }
      case '@rules': {
        user.socket.write(yellowText(`
       _____                  _____     _
      |   __|___ _____ ___   | __  |_ _| |___ ___
      |  |  | .'|     | -_|  |    -| | | | -_|_ -|
      |_____|__,|_|_|_|___|  |__|__|___|_|___|___|
    \n`));
        user.socket.write(grayText(`
      "PhraseCraze" is a derivative of the popular word game "Mad-Libs"!
      The admin will write a story with certain words surrounded in brackets [].
      The words that are surrounded by brackets are known as "keywords" and these keywords are sent to players, the players then put their own keywords in place of the generic words.
      For example: If the admin writes "[Male_Name] and his pet [Animal] went for a walk!",
      two keywords are sent out and players insert their own words to match the description of the word in the brackets.
      The script is then reconstructed with player generated words and shown back to all players: "Gerald and his pet koala went for a walk!"
    \n`));
      }
        if (mockCommand[0] === '@rules') {
          expect(user.socket.write).toEqual(yellowText(`
       _____                  _____     _
      |   __|___ _____ ___   | __  |_ _| |___ ___
      |  |  | .'|     | -_|  |    -| | | | -_|_ -|
      |_____|__,|_|_|_|___|  |__|__|___|_|___|___|
    \n`));
        }
    }
  };
});
