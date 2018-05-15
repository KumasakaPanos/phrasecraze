'use strict';

import { Json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';

const scriptRouter = new Router();
const jsonParser = new Json();

scriptRouter.post('/script', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad Content: Title Required'));
  return new Script(request.body).save()
    .then((script) => {
      // scrub logic
      const keywords = script.match(/(.+?)(?!<>)>/); 
      // returns array
      const solution = [];
      for (let i = 0; i < keywords.length; i++) {
        solution.push(new keywords(keywords[i], i));
      }
    })
    .then(keywords => response.json(keywords))
    .catch(next);
});

scriptRouter.get('/script/:title', (request, response, next) => {
  if (!request.params.title) return next(new HttpError(400, 'Bad Content: id is required'));
  return Script.findOne(request.params.title)
    .then(script => response.json(script))
    .catch(next);
});
