'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Script from '../model/script-model';
import { startServer, stopServer } from '../lib/http';

const apiURL = `http://localhost:${process.env.HTTP_PORT}/script`;

const createScriptMock = () => {
  return new Script({
    title: faker.lorem.words(2),
    content: 'Jack and [female-name] went up a what.',
    id: 'this is a test id',
  }).save();
};

const removeScriptMock = () => Script.remove({});

describe('/script', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Script.remove({}));
  test.only('POST - It should respond with a 200 status ', () => {
    const scriptToPost = {
      title: faker.lorem.words(2),
      content: 'Jack and [female-name] went up a [what].',
    };
    return superagent.post(apiURL)
      .send(scriptToPost)
      .then((response) => {
        console.log(response.body, 'this is the object that will be passed onto the TCP Server');
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(scriptToPost.title);
      });
  });
});

describe('/script/:id', () => {
  test('GET - it should respond with a 200 status and the content', () => {
    let tempScript = {};
    return createScriptMock()
      .then((script) => {
        tempScript = script;
        return superagent.get(`${apiURL}/${script/id}`)
          .then((response) => {
            console.log(response.body, 'inside the GET test');
            expect(response.status).toEqual(200);
            // expect(response.body._id).toEqual(tempScript._id.toString());
            // expect(response.body.content).toEqual(tempScript.body.content);
          });
      });
  });
});
