'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';
import Keyword from '../model/keyword-model';

const bodyParser = require('body-parser');

const scriptRouter = new Router();
const jsonParser = new json();

scriptRouter.post('/script', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad Content: Title Required'));
  return new Script(request.body).save()
    .then((script) => {
      script.title = script._id;
      // scrub logic
      const keywords = script.match(/(.+?)(?!<>)>/);
      // returns array
      const solution = [];
      for (let i = 0; i < keywords.length; i++) {
        solution.push(new Keyword(keywords[i], i));
      }
    })
    .then(keywords => response.json(keywords))
    .catch(next);
});

scriptRouter.put('/keywords', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad content:  not recieved'));
  let keywords=jsonParser(request.body.content);
  let areKeyWordsOrdered=false;
  let keyWordsInOrder = new [];
  while (areKeyWordsOrdered !==true) {
    let i=0;
    while (i !== keywords[i].placement) { i += 1; }
    keyWordsInOrder.push(keywords[i].content);
    if (i > keywords.length) { areKeyWordsOrdered = true; }
  }
}.save(keyWordsInOrder))


scriptRouter.get('/script/:title', (request, response, next) => {
  if (!request.params.title) return next(new HttpError(400, 'Bad Content: title is required'));

  let keywords=request.body.array;
  let scriptChunkArray=[];
  let scriptChunkRegEx=/.*?\[/;
  let scriptChunkCleanerRegEx=/.*?\]/;
  
  return Script.findOne(request.body.title)
    .then(script => {
      while(scriptChunkRegEx.test(script))
      {scriptChunkArray.push(script.splice(0,scriptChunkRegEx.exec(script).index-1))};

      for(let i = 0;i<scriptChunkArray.length;i++)
      {
        scriptChunkArray[i]=scriptChunkArray[i].splice(scriptChunkCleanerRegEx.exec(scriptChunkArray[i]).index-1);
      }
      let chunkRepeat=true;
      let keyRepeat=true;
      let finishedScript=``;
      while(chunkRepeat===true||keyRepeat===true)
      {
        chunkRepeat=false;
        keyRepeat=false;
        if(scriptChunkArray[i]){
          chunkRepeat=true;
          finishedScript=`${finishedScript}${scriptChunkArray[i]}`;
        }
        if(keywords[i].content){
          keyRepeat=true;
          finishedScript=`${finishedScript}${script.keywords[i]}`;
        }
      }
      response.body=finishedScript;
    })
    .catch(next);
});

export default scriptRouter;
