'use strict';

import bodyParser from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';

const scriptRouter = new Router();
const jsonParser = bodyParser.json();

scriptRouter.post('/script', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad Content: Title Required'));
  return new Script(request.body).save()
    console.log(response.body, 'inside the POST route')
    .then((script) => {
      console.log(script, 'inside .then on POST route');
      // scrub logic
      const keywords = script.match() 
      // returns array
      const solution = [];
      for (let i = 0; i < keywords.length; i++) {
        solution.push(new keywords(keywords[i], i));
      }
      // for loop over array to touch each string
      // assign Keyword parameters of content and position
     
      // return array of keywords
    })
    .then(keywords => response.json(keywords))
    .catch(next);
});

scriptRouter.get('/api/script/:title', (request, response, next) => {
  if (!request.params.id) return next(new HttpError(400, 'Bad Content: id is required'));
  return Script.findOne(request.params.title)
    .then(script => response.json(script))
    .catch(next);
});

export default scriptRouter;
