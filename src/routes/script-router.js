'use strict';

import bodyParser from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';

const scriptRouter = new Router();
const jsonParser = bodyParser.json();

scriptRouter.post('/api/script', jsonParser, (request, response, next) => {
  if (!request.body.title) return next(new HttpError(400, 'Bad Content: Title Required'));
  return new Script(request.body).save()
    .then(script => response.json(script))
    .catch(next);
});

scriptRouter.get('/api/script/:title', (request, response, next) => {
  if (!request.params.id) return next(new HttpError(400, 'Bad Content: id is required'));
  return Script.findOne(request.params.title)
    .then(script => response.json(script))
    .catch(next);
});
export default scriptRouter;
