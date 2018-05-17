'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';
import Keyword from '../model/keyword-model';

const bodyParser = require('body-parser');

const keywordRouter = new Router();
const jsonParser = new json();

keywordRouter.post('/keys', jsonParser, (request, response, next) => {
  console.log(request.body.title);
  return Script.findOne(request.body.title)
    .then((script) => {
      // panos Magic logic
      return updatedScript;
    });
});
