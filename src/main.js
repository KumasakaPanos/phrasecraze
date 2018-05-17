'use strict';

import { startServer } from './lib/http';

const serverTCP = require('./lib/tcp-server.js');

serverTCP.start();
startServer();
