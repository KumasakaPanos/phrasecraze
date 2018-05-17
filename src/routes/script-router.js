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
      const keywords = script.content.match(/\[(.*?)\]/g)
        .map(keyword => keyword.substring(1, keyword.length - 1));
      const solution = {};
      solution.keywordsArray = [];
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

scriptRouter.get('/script', jsonParser, (request, response, next) => {
  return Script.findOne({ title: request.body.title })
    .then((script) => {
      const keywords = script.content.match(/\[(.*?)\]/g)
        .map(keyword => keyword.substring(1, keyword.length - 1));
      const solution = {};
      solution.keywordsArray = [];
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


scriptRouter.get('/titles', jsonParser, (request, response, next) => {
  return Script.find({ }, { title: 1 })
    .then((titles) => {
      const titleReturn = [];
      titles.forEach((title) => {
        titleReturn.push(title.title);
      });
      return (titleReturn);
    })
    .then((list) => {
      return response.json(list);
    })
    .catch(next);
});


scriptRouter.put('/keys', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad content:  not recieved'));
  const keywords = request.body.keywordsArray;
  const keyWordsInOrder = [];

  for (let i = 0; i < keywords.length; i++) {
    keyWordsInOrder[keywords[i].placement] = keywords[i].content;
  }

  return Script.findOne({ title: request.body.title })
    .then((script) => {
      return response.json(scriptRouter.compileScript(script, keywords));  
    });
});

scriptRouter.compileScript = (script, keywords) => {
  const scriptDummy = script;

  let solution;
  const findKeyword = /(\[.*?\])/;
  
  for (let i = 0; i < keywords.length; i++) {
    solution = scriptDummy.content.replace(findKeyword, keywords[i]);
    scriptDummy.content = solution;
  }
  console.log('reconstructed script', scriptDummy);
  return scriptDummy.content;
};

export default scriptRouter;
