declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHANNEL_ACCESS_TOKEN: string;
      CHANNEL_SECRET: string;
      PORT: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    _csrf: string;
    _fitbitToken: ClientOAuth2.Token;
    _fitbitProfile: ResponseFitbitProfile;
  }
}

export {};
