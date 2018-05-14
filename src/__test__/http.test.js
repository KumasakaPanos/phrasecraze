'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Script from '../model/script-model';
import { startServer, stopServer } from '../lib/http';

const apiURL = `http://localhost:${process.env.PORT}/api/script`;

const createScriptMock = () => {
  return new Script({
    title: faker.lorem.words(10),
    content: faker.lorem.words(25),
  }).save();
};

describe('/api/script', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Script.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const scriptToPost = {
      title: faker.lorem.words(10),
      content: faker.lorem.words(25),
    };
    return superagent.post(apiURL)
      .send(scriptToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(scriptToPost.title);
        expect(response.body.content).toEqual(scriptToPost.content);
        expect(response.body._id).toBeTruthy();
        expect(response.body.date).toBeTruthy();
      });
  });
});
