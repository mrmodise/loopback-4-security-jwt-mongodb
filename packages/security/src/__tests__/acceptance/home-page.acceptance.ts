import {Client} from '@loopback/testlab';
import {Loopback4SecurityApplication} from '../../index';
import {setupApplication} from './test-helper';

describe('HomePage', () => {
  let app: Loopback4SecurityApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('exposes a default home page', async () => {
    await client
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  });
});
