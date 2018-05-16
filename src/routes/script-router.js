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

// scriptRouter.get('/script/:id', (request, response, next) => {
//   console.log(request, 'this is the request in GET route');
//   console.log(response, 'this is the response in the GET route');
//   // logger.log(logger.INFO, 'GET - processing a request');
//   return Script.findById(request.params.id)
//     .then((script) => {
//       if (!script) {
//         logger.log(logger.INFO, 'GET - responding with a 404 status code - (!script)');
//         return response.sendStatus(404);
//       }
//       logger.log(logger.INFO, 'GET - responding with a 200 status code');
//       return response.json(script);
//     })
//     .catch(next);
// });

// Expected 

// scriptRouter.post('/keys', jsonParser, (request, response, next) => {
//   console.log(request.body.title);
//   return Script.findOne(request.body.title)
//     .then((script) => {
//       // panos Magic logic
//       return updatedScript;
//     });
// });

// added

scriptRouter.put('/keys', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad content:  not recieved'));
  console.log('hit the PUT ROUTE');
  console.log('Request Content', request.body);
  const keywords = request.body.content;
  let areKeyWordsOrdered = false;
  const keyWordsInOrder = [];
  console.log('hit before while loop');

  while (areKeyWordsOrdered !== true) { // order the keywords
    let i = 0;
    console.log(keywords[i]);
    console.log(keywords[i].placement);
    while (i !== keywords[i].placement) { i += 1; }
    keyWordsInOrder.push(keywords[i].content);
    if (i >= keywords.length) { areKeyWordsOrdered = true; }
  }

  console.log('KeyWords in order', keyWordsInOrder);
  return Script.findOne({ title: request.body.title })
    .then((script) => {
      console.log('Found Script', script);
      return response.json(scriptRouter.compileScript(script, keyWordsInOrder)); 
    });
});

scriptRouter.compileScript = (script, keywords) => {
  const scriptChunkArray = [];
  const scriptChunkRegEx = /.*?\[/;
  const scriptChunkCleanerRegEx = /.*?\]/;

  console.log(script);
  
  while (scriptChunkRegEx.test(script.content)) { // push strings from script into array
    scriptChunkArray.push(script.content.splice(0, scriptChunkRegEx.exec(script).index - 1));
    script.content.splice(0, scriptChunkRegEx.exec(script).index);
  }

  for (let i = 0; i < scriptChunkArray.length; i++) {
    if (scriptChunkCleanerRegEx.test(scriptChunkArray[i])) {
      scriptChunkArray[i] = scriptChunkArray[i].splice(scriptChunkCleanerRegEx.exec(scriptChunkArray[i]).index - 1); /* eslint-disable-line */
    }
  }

  // script is empty string
  // script contents are in array
  // keywords are blank spaces
  // [him] and [her] went [here][there].
  // ['', ' and ', ' went ', ' and ', '.']
  // [him,her,here,there]
  let chunkRepeat = true;
  let keyRepeat = true;
  let finishedScript = '';
  let i = 0;
  while (chunkRepeat === true || keyRepeat === true) {
    chunkRepeat = false;
    keyRepeat = false;
    if (scriptChunkArray[i]) {
      chunkRepeat = true;
      finishedScript = `${finishedScript}${scriptChunkArray[i]}`;
    }
    if (keywords[i]) {
      keyRepeat = true;
      if (keywords[i].content) {
        finishedScript = `${finishedScript}${script.keywords[i]}`;
      }
    }
    i += 1;
  }
  return finishedScript;
};

export default scriptRouter;
