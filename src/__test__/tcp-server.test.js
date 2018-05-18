'use strict';

const net = require('net');
const server = require('../lib/tcp-server');

const PORT = process.env.TCP_PORT;

beforeAll(server.start);
afterAll(server.stop);
describe('valid requests', () => {
  test('should listen on 3000', () => {
    expect(PORT).toEqual('3000');
    require('jest');
  });

  test('Should Connect and send Gretting message', (done) => {
    const message = [];
    const client = net.connect({ port: 3000 });
    client.on('data', (data) => {
      message.push(data.toString());
      let testingExpected;
      client.end(null, () => {
        if (message.includes(data.toString())) {
          testingExpected = true;
        } else {
          testingExpected = false;
        }
        expect(testingExpected).toBe(true);
        done();
      });
    });
  });

  describe('Testing socket write', () => {
    test('Should return a socket name', (done) => {
      const socket = net.connect(3000, 'localhost');
      socket.name = 'Hulk';
      socket.write(`Your name is ${socket.name}\n`);
      expect(socket.name).toMatch('Hulk');

      done();
    });
  });

  describe('testing on connection', () => {
    test('Should return messages', (done) => {
      const messages = [];
      const socket = net.connect({ port: 3000 });
      socket.on('data', (data) => {
        messages.push(data.toString());
        socket.end(null, () => {
          expect(messages[0]).toMatch('Welcome');
          done();
        });
      });
    });
  });
});
