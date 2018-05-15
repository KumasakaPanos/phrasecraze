'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';
import Keyword from '../model/keyword-model';

const bodyParser = require('body-parser');

const keywordRouter = new Router();
const jsonParser = new json();

keywordRouter.post('/keywords', jsonParser, (request, response, next) => {

});
