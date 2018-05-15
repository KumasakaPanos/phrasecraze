'use strict';

import logger from './logger';

export default (request, response, next) => {
  logger.log(logger.INFO, `Processing a ${request.method} on ${request.url}`);
  return next();
};
