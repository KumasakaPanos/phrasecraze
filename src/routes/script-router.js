'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';
import logger from '../lib/logger';

const scriptRouter = new Router();
const jsonParser = new json();

scriptRouter.post('/api/script', jsonParser, (request, response, next) => {
  if(!request.body.title) return next(new HttpError(400, 'Bad Content: Title Required'));
  return new Script(request.body).save()
    .then(script => response.json(script))
    .catch(next);
});

scriptRouter.get('/api/script/:id', (request, response, next) => {

});
