'use strict';

import express from 'express';
import mongoose from 'mongoose';

import bodyParser from 'body-parser';
import logger from './logger';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';
import scriptRouter from '../routes/script-router';

const app = express();
let server = null;

app.use(loggerMiddleware);

app.use(scriptRouter);

import logger from './logger';
import scriptRouter from '../routes/script-router';

const router = express.Router();

// app.use(whatever);  <---- add routes here
const app = express();
let server = null;

app.use(scriptRouter);

app.all('*', (request, response) => { 
  return response.sendStatus(404);  
});


// app.use(bodyParser);

app.use(errorMiddleware);



const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on PORT: ${process.env.PORT}`);
      });
      return undefined;
    })
    .catch((err) => {
      logger.log(logger.ERROR, `Something happened, ${JSON.stringify(err)}`);
    });
};
const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      return server.close(() => {
        logger.log(logger.INFO, 'Server is off.');
      });
    })
    .catch((err) => {
      return logger.log(logger.ERROR, `Something Happened, ${JSON.stringify(err)}`);
    });
};

export { startServer, stopServer };
