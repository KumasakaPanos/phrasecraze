'use strict';

const server = require('./lib/tcp-server.js');
const logger = require('./lib/logger');

server.start(process.env.TCP_PORT, () => logger.log(logger.INFO, `Listening on port ${process.env.TCP_PORT}`));
