'use strict';

import bodyParser from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';
import Keyword from '../model/keyword-model';
import logger from '../lib/logger';

const scriptRouter = new Router();
const jsonParser = bodyParser.json();

const Word = class {
  constructor(content, placement) {
    this.content = content;
    this.placement = placement;
  }
};

scriptRouter.post('/script', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad Content: Title Required'));
  return new Script(request.body).save()
    .then((script) => {
      // parsing the keywords out of the script
      const keywords = script.content.match((/(?<=\[)(.*?)(?=\])/g));
      // returns array
      const solution = [];
      for (let i = 0; i < keywords.length; i++) {
        solution.push(new Word(keywords[i], i));
      }
      return solution;
    })
    .then((keywords) => {
      return response.json(keywords);
    })
    .catch(next);
});

scriptRouter.get('/script/:id', (request, response, next) => {
  console.log(request, 'this is the request in GET route');
  console.log(response, 'this is the response in the GET route');
  // logger.log(logger.INFO, 'GET - processing a request');
  return Script.findById(request.params.id)
    .then((script) => {
      if (!script) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!script)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(script);
    })
    .catch(next);
});

export default scriptRouter;
