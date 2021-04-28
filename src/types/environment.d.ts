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
    views: number;
    _csrf: string;
    _fitbitData: string;
    _fitbitProfile: ResponseFitbitProfile;
  }
}

export {};
