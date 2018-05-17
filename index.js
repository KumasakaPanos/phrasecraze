'use strict';

require('dotenv').config();

process.env.NODE_ENV = 'development';
process.env.PORT = 5000;

if (!process.env.NODE_ENV) {
  throw new Error('Undefined NODE_ENV');
}

if (process.env.NODE_ENV !== 'production') {
  require('babel-register');
  console.log('requiring')
}

require('./src/main');
