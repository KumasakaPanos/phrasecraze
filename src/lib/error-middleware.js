'use strict';

import logger from './logger';

export default (error, request, response, next) => { // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE__');
  logger.log(logger.ERROR, error);

  if (error.status) {
    logger.log(logger.INFO, `ERROR MIDDLEWARE: Responding with a ${error.status} code and message ${error.message}`);
    return response.sendStatus(error.status);
  }
};
