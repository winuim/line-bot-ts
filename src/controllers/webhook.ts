import {
  AudioEventMessage,
  Client,
  ClientConfig,
  EventSource,
  ImageEventMessage,
  LocationEventMessage,
  StickerEventMessage,
  TextMessage,
  VideoEventMessage,
  WebhookEvent,
} from '@line/bot-sdk';
import cp from 'child_process';
import fs from 'fs';
import path from 'path';

import botText from '../config/botText.json';
import {fitbitAuth} from '../lib/fitbitApi';

type BotText = typeof botText;
type botTextKey = keyof BotText;

// Setup all LINE client configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

// base URL for webhook server
export const baseURL = process.env.BASE_URL || 'http://localhost:3000';

// Create a new LINE SDK client.
export const client = new Client(clientConfig);

// event handler
export const handleEvent = (event: WebhookEvent) => {
  if (event.type === 'message') {
    if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
      return console.log(
        'Test hook recieved: ' + JSON.stringify(event.message)
      );
    }
  }

  switch (event.type) {
    case 'message': {
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }
    }
    case 'follow': {
      return replyText(event.replyToken, 'Got followed event');
    }
    case 'unfollow': {
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    }
    case 'join': {
      return replyText(event.replyToken, `Joined ${event.source.type}`);
    }
    case 'leave': {
      return console.log(`Left: ${JSON.stringify(event)}`);
    }
    case 'postback': {
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event.replyToken, `Got postback: ${data}`);
    }
    case 'beacon': {
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);
    }
    default: {
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
  }
};

// simple reply function
export const replyText = (token: string, texts: string | string[]) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map(text => ({type: 'text', text}))
  );
};

// content download
export const downloadContent = (messageId: string, downloadPath: string) => {
  console.log(`messageId: ${messageId}, downloadpath: ${downloadPath}`);
  return client
    .getMessageContent(messageId)
    .then(
      stream =>
        new Promise((resolve, reject) => {
          const writable = fs.createWriteStream(downloadPath);
          stream.pipe(writable);
          stream.on('end', () => resolve(downloadPath));
          stream.on('error', reject);
        })
    )
    .then(() => {
      return downloadPath;
    });
};

export const handleText = (
  message: TextMessage,
  replyToken: string,
  source: EventSource
) => {
  switch (message.text) {
    case 'profile': {
      if (source.userId) {
        return client
          .getProfile(source.userId)
          .then(profile =>
            replyText(replyToken, [
              `Display name: ${profile.displayName}`,
              `Picture: ${profile.pictureUrl}`,
              `Status message: ${profile.statusMessage}`,
            ])
          );
      } else {
        return replyText(
          replyToken,
          "Bot can't use profile API without user ID"
        );
      }
    }
    case 'bye': {
      switch (source.type) {
        case 'user': {
          return replyText(replyToken, "Bot can't leave from 1:1 chat");
        }
        case 'group': {
          return replyText(replyToken, 'Leaving group').then(() =>
            client.leaveGroup(source.groupId)
          );
        }
        case 'room': {
          return replyText(replyToken, 'Leaving room').then(() =>
            client.leaveRoom(source.roomId)
          );
        }
      }
    }
    // eslint-disable-next-line no-fallthrough
    case 'fitbit': {
      const uri = fitbitAuth.code.getUri();
      return replyText(replyToken, uri);
    }
    default: {
      const textKey = message.text;
      if (textKey in botText) {
        const responseString = JSON.stringify(botText[textKey as botTextKey]);
        const msg = JSON.parse(responseString.replace(/\$BASE_URL/g, baseURL));
        return client.replyMessage(replyToken, msg as TextMessage);
      } else {
        console.log(`Echo message to ${replyToken}: ${message.text}`);
        return replyText(replyToken, message.text);
      }
    }
  }
};

export const handleImage = (message: ImageEventMessage, replyToken: string) => {
  let getContent;
  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(
      'dist/public/downloaded',
      `${message.id}.jpg`
    );
    const previewPath = path.join(
      'dist/public/downloaded',
      `${message.id}-preview.jpg`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      downloadPath => {
        // ImageMagick is needed here to run 'convert'
        // Please consider about security and performance by yourself
        const execCmd = `convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`;
        console.log(`exec: ${execCmd}`);
        cp.execSync(execCmd);

        return {
          originalContentUrl:
            baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl:
            baseURL + '/downloaded/' + path.basename(previewPath),
        };
      }
    );
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({originalContentUrl, previewImageUrl}) => {
    return client.replyMessage(replyToken, {
      type: 'image',
      originalContentUrl,
      previewImageUrl,
    });
  });
};

export const handleVideo = (message: VideoEventMessage, replyToken: string) => {
  let getContent;
  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(
      'dist/public/downloaded',
      `${message.id}.mp4`
    );
    const previewPath = path.join(
      'dist/public/downloaded',
      `${message.id}-preview.jpg`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      downloadPath => {
        // FFmpeg and ImageMagick is needed here to run 'convert'
        // Please consider about security and performance by yourself
        const execCmd = `convert mp4:${downloadPath}[0] jpeg:${previewPath}`;
        console.log(`exec: ${execCmd}`);
        cp.execSync(execCmd);

        return {
          originalContentUrl:
            baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl:
            baseURL + '/downloaded/' + path.basename(previewPath),
        };
      }
    );
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({originalContentUrl, previewImageUrl}) => {
    return client.replyMessage(replyToken, {
      type: 'video',
      originalContentUrl,
      previewImageUrl,
    });
  });
};

export const handleAudio = (message: AudioEventMessage, replyToken: string) => {
  let getContent;
  if (message.contentProvider.type === 'line') {
    const downloadPath = path.join(
      'dist/public/downloaded',
      `${message.id}.m4a`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      downloadPath => {
        return {
          originalContentUrl:
            baseURL + '/downloaded/' + path.basename(downloadPath),
        };
      }
    );
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({originalContentUrl}) => {
    return client.replyMessage(replyToken, {
      type: 'audio',
      originalContentUrl,
      duration: message.duration,
    });
  });
};

export const handleLocation = (
  message: LocationEventMessage,
  replyToken: string
) => {
  return client.replyMessage(replyToken, {
    type: 'location',
    title: message.title,
    address: message.address,
    latitude: message.latitude,
    longitude: message.longitude,
  });
};

export const handleSticker = (
  message: StickerEventMessage,
  replyToken: string
) => {
  return client.replyMessage(replyToken, {
    type: 'sticker',
    packageId: message.packageId,
    stickerId: message.stickerId,
  });
};
