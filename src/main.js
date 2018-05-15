'use strict';

import { startServer } from './lib/http';

const serverTCP = require('./lib/tcp-server.js');
// const serverHTTP = require('./lib/http');

serverTCP.start();
startServer();
