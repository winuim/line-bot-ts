import {
  Client,
  ClientConfig,
  MessageAPIResponseBase,
  TextMessage,
  WebhookEvent,
} from '@line/bot-sdk';

// Setup all LINE client configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

// Create a new LINE SDK client.
export const client = new Client(clientConfig);

// Function handler to receive the text.
export const textEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  // Process all variables here.
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  // Process all message related variables here.
  const {replyToken} = event;
  const {text} = event.message;

  // Create a new message.
  const response: TextMessage = {
    type: 'text',
    text,
  };

  // Reply to the user.
  return await client.replyMessage(replyToken, response);
};
