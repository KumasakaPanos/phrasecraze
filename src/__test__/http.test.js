'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Script from '../model/script-model';
import { startServer, stopServer } from '../lib/http';

const apiURL = `http://localhost:${process.env.HTTP_PORT}/script`;

const createScriptMock = () => {
  return new Script({
    title: faker.lorem.words(2),
    content: 'The holy hand-grenade of [city-name].',
    id: 'this is a test id',
  }).save();
};

const removeScriptMock = () => Script.remove({});

describe('POST /script', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Script.remove({}));
  test('POST - it should respond with a 200 status ', () => {
    const scriptToPost = {
      title: faker.lorem.words(2),
      content: 'Hello [].',
    };
    return superagent.post(apiURL)
      .send(scriptToPost)
      .then((response) => {
        // console.log(response.body, 'this is the object that will be passed onto the TCP Server');
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(scriptToPost.title);
      });
  });
  test('POST - it should fail and return a 400 for bad content: title is required is there is no request.body.title', () => {
    const scriptToPost = {
      content: 'Hello [].',
    };
    return superagent.post(apiURL)
      .send(scriptToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});

// describe('PUT /script', () => {
//   test('PUT - it should update a script and return a 200 status code', () => {
//     return createScriptMock()
//       .then((scriptMock) => {
//         return superagent.put(`${apiURL}/${scriptMock.title}`)
//           .send({ content: 'I\'m not [adjective] yet.' });
//       })
//       .then((response) => {
//         expect(response.status).toEqual(200);
//       });
//   });
// });
