import {client, textEventHandler} from '../../src/controlles/webhook';

jest.mock('@line/bot-sdk');

describe('webhook.ts test', () => {
  beforeEach(() => {
    client.replyMessage = jest
      .fn()
      .mockImplementation((token: string, texts: string | string[]) => {
        console.log(`token:${token}, texts:${JSON.stringify(texts)}`);
        return new Promise(resolve => {
          resolve({
            token: token,
            texts: JSON.stringify(texts),
          });
        });
      });
  });
  test('textEventHandler ping', async () => {
    const expected = await textEventHandler({
      type: 'message',
      message: {
        id: '0000000000',
        type: 'text',
        text: 'ping',
      },
      mode: 'active',
      timestamp: 0,
      source: {
        type: 'user',
        userId: '0000000001',
      },
      replyToken: '0000000002',
    });
    expect(expected).toEqual({
      token: '0000000002',
      texts: JSON.stringify({type: 'text', text: 'ping'}),
    });
  });
});
