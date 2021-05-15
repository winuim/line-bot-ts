// Import all dependencies, mostly using destructuring for better view.
import {
  JSONParseError,
  middleware,
  MiddlewareConfig,
  SignatureValidationFailed,
  WebhookEvent,
} from '@line/bot-sdk';
import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import session from 'express-session';
import * as FitbitOAuth2 from 'passport-fitbit-oauth2';
import OAuth2Strategy from 'passport-oauth2';
import {v4 as genuuid} from 'uuid';

import {handleEvent} from './controllers/webhook';
import {
  authCallback,
  getActivity,
  getHeartRate,
  getProfile,
  getSleep,
  getSteps,
  initAuth,
} from './controllers/fitbit';

// Setup Express configurations.
const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const PORT = process.env.PORT || 3000;

// Create a new Express application.
const app: Application = express();

// Express configuration
app.set('port', PORT);
app.use(morgan('combined'));

// serve static files
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

// error handling
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof SignatureValidationFailed) {
      res.status(401).send(err.signature);
      return;
    } else if (err instanceof JSONParseError) {
      res.status(400).send(err.raw);
      return;
    }
    next(err); // will throw default 500
  }
);

// session configuration
const sess: session.SessionOptions = {
  genid: function (req) {
    return genuuid();
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
};
// server secure
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie = sess.cookie || {};
  sess.cookie.secure = true; // serve secure cookies
}

// Use the session middleware
app.use(session(sess));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());

const strategy = new FitbitOAuth2.FitbitOAuth2Strategy(
  {
    authorizationURL: 'https://www.fitbit.com/oauth2/authorize',
    tokenURL: 'https://api.fitbit.com/oauth2/token',
    clientID: process.env.FITBIT_CLIENT_ID || '',
    clientSecret: process.env.FIBIT_CLIENT_SECRET || '',
    callbackURL: process.env.BASE_URL + '/auth/fitbit/callback',
    scope: [
      'activity',
      'heartrate',
      'location',
      'nutrition',
      'profile',
      'settings',
      'sleep',
      'social',
      'weight',
    ],
  },
  (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: OAuth2Strategy.VerifyCallback
  ) => {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    return done(null, profile);
  }
);

passport.use('fitbit', strategy);
// passport routing
app.get('/auth/fitbit', passport.authenticate('fitbit'));
app.get(
  '/auth/fitbit/callback',
  passport.authenticate('fitbit', {
    successRedirect: '/auth/fitbit/success',
    failureRedirect: '/auth/fitbit/failure',
  })
);
passport.serializeUser((user, done) => {
  console.log('serializeUser');
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  console.log('deserializeUser');
  if (
    obj === false ||
    obj === null ||
    obj === undefined ||
    typeof obj === 'object'
  ) {
    done(null, obj);
  }
});
app.get('/auth/fitbit/success', (req, res, next) => {
  console.log('/auth/fitbit/success');
  res.send(req.user);
});
app.get('/auth/fitbit/failure', (req, res, next) => {
  console.log('/auth/fitbit/failure');
  res.send(res.statusMessage);
});

// Route handler to receive webhook events.
// This route is used to receive connection tests.
// Access the session as req.session
app.get('/', (req, res, next) => {
  if (req.session.views) {
    req.session.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>');
    if (req.session.cookie.maxAge) {
      res.write('<p>expires in: ' + req.session.cookie.maxAge / 1000 + 's</p>');
    }
    res.end();
  } else {
    req.session.views = 1;
    res.end('welcome to the session demo. refresh!');
  }
});

// heartbeat
app.get('/heartbeat', async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).json({
    status: 'success',
    message: 'working',
  });
});

// Register the LINE middleware.
// As an alternative, you could also pass the middleware in the route handler, which is what is used here.
// app.use(middleware(middlewareConfig));

// This route is used for the Webhook.
app.post(
  '/webhook',
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    if (req.body.destination) {
      console.log('Destination User ID: ' + req.body.destination);
    }

    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
      return res.status(500).json({
        status: 'error',
      });
    }

    const events: WebhookEvent[] = req.body.events;

    // Process all of the received events asynchronously.
    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          return await handleEvent(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }

          // Return an error message.
          return res.status(500).json({
            status: 'error',
          });
        }
      })
    );

    // Return a successfull message.
    return res.status(200).json({
      status: 'success',
      results,
    });
  }
);

// fitbit auth callback
app.get('/fitbit/auth', initAuth);
app.get('/fitbit/callback', authCallback);
app.get('/fitbit/profile', getProfile);
app.get('/fitbit/activity', getActivity);
app.get('/fitbit/steps', getSteps);
app.get('/fitbit/heartrate', getHeartRate);
app.get('/fitbit/sleep', getSleep);

export default app;
