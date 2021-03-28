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
import path from 'path';
import {
  authCallback,
  getActivity,
  getProfile,
  initAuth,
} from './controllers/fitbit';
import {handleEvent} from './controllers/webhook';

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

// Route handler to receive webhook events.
// This route is used to receive connection tests.
app.get(
  '/',
  async (_: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      status: 'success',
      message: 'Connected successfully!',
    });
  }
);

// heartbeat
app.get(
  '/heartbeat',
  async (_: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      status: 'success',
      message: 'working',
    });
  }
);

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

export default app;
