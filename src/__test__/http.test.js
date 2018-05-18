'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Script from '../model/script-model';
import { startServer, stopServer } from '../lib/http';

const apiURL = `http://localhost:${process.env.HTTP_PORT}`;

const createScriptMock = () => {
  return new Script({
    title: faker.lorem.words(1),
    content: 'Jack and [name] went up a [what].',
  }).save();
};

const removeScriptMock = () => Script.remove({});

describe('/invalid route', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeScriptMock);
  test('GET - It should respond with 404 status for no content', () => {
    const invalidId = '';
    return superagent.get(`${apiURL}/${invalidId}`)
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(404);
      });
  });
});

describe('/script route', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeScriptMock);
  test('POST - It should respond with a 200 status ', () => {
    const scriptToPost = {
      title: faker.lorem.words(1),
      content: 'Jack and [name] went up a [].',
    };
    return superagent.post(`${apiURL}/script`)
      .send(scriptToPost)
      .then((response) => {
        console.log(response.body, 'this is the object that will be passed onto the TCP Server');
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(scriptToPost.title);
      });
  });
  test('POST - It should respond with 400 status for no content', () => {
    return superagent.post(`${apiURL}/script`)
      .send()
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(400);
      });
  });
  test('GET - it should respond with a 200 status and the content', () => {
    const temp = {};
    return createScriptMock()
      .then((script) => {
        temp.script = script;
        return superagent.get(`${apiURL}/script`)
          .send(script)
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.keywordsArray).toEqual([{ content: 'name', placement: 0 }, { content: 'what', placement: 1 }]);
          });
      });
  });
});

describe('/titles route', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeScriptMock);
  test('GET - Should return 200 status and all titles in the Database', () => {
    return createScriptMock()
      .then(() => {
        return superagent.get(`${apiURL}/titles`)
          .then((response) => {
            expect(response.status).toBe(200);
          });
      });
  });
});

describe('/keywords route', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeScriptMock);
  test('PUT - Should return 200 status and reconstructed script', () => {
    return createScriptMock()
      .then((script) => {
        return superagent.put(`${apiURL}/keys`)
          .send({ keywordsArray: [{ content: 'name', placement: 0 }, { content: 'name', placement: 1 }], title: script.title })
          .then((response) => {
            expect(response.status).toEqual(200);
          });
      });
  });
});

