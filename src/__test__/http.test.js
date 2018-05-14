'use strict';

import faker from 'faker';
import superagent from 'superagent';
import script from '../model/script-model';
import { startServer, stopServer } from '../lib/http';

const apiURL = `http://localhost:${process.env.PORT}/api/scripts`;

const createScriptMock = () => {
  return new Script({
    title: faker.lorem.words(10),
    content: faker.lorem.words(25),
  }).save();
};

describe('/api/scripts', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => script.remove({}));
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
