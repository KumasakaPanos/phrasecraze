'use strict';

import bodyParser from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';

const scriptRouter = new Router();
const jsonParser = bodyParser.json();

const Word = class {
  constructor(content, placement) {
    this.content = content;
    this.placement = placement;
  }
};

scriptRouter.post('/script', jsonParser, (request, response, next) => {
  if (!request.body.title) return next(new HttpError(400, 'Bad Content: Title Required'));
  return new Script(request.body).save()
    .then((script) => {
      // parsing the keywords out of the script
      const keywords = script.content.match((/(?<=\[)(.*?)(?=\])/g));
      // returns array
      const solution = {};
      solution.keywordsArray = new Array();
      solution.title = script.title;
      for (let i = 0; i < keywords.length; i++) {
        solution.keywordsArray.push(new Word(keywords[i], i));
      }
      return solution;
    })
    .then((solution) => {
      return response.json(solution);
    })
    .catch(next);
});

scriptRouter.put('/keys', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad content:  not received'));
  console.log('hit the PUT ROUTE');
  console.log('Request Content', request.body);
  const keywords = request.body.keywordsArray;
  let areKeyWordsOrdered = false;
  const keyWordsInOrder = [];
  console.log('hit before while loop');

  let counter = 0;
  while (areKeyWordsOrdered === false) { 
    let i = 0;


    while (i !== keywords[counter].placement) { 
      i += 1; 
      if (i >= keywords.length) { areKeyWordsOrdered = true; }
    }
    
    counter += 1;
    keyWordsInOrder.push(keywords[i].content);

    if (counter >= keywords.length) { 
      areKeyWordsOrdered = true; 
    }
  }

  console.log('KeyWords in order', keyWordsInOrder);
  return Script.findOne({ title: request.body.title })
    .then((script) => {
      console.log('Found Script');
      return response.json(scriptRouter.compileScript(script, keyWordsInOrder)); 
    });
});

scriptRouter.compileScript = (script, keywords) => {
  console.log('script before reconstructed', script);
  console.log('keywords', keywords);

  let solution;
  const findKeyword = /(\[.*?\])/;
  
  for (let i = 0; i < keywords.length; i++) {
    solution = script.content.replace(findKeyword, keywords[i]);
    script.content = solution;
  }
  console.log('reconstructed script', script);
  return script.content;
};

export default scriptRouter;
