'use strict';

require('dotenv').config();
require('babel-register');

if (process.env.NODE_ENV !== 'production') {
  require('babel-register');
}

if (!process.env.NODE_ENV) {
  throw new Error('Undefined NODE_ENV');
}

if (process.env.NODE_ENV === 'localtesting') {
  require('babel-register');
}

require('./src/main');
