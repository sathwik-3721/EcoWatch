// Import the entire passport module as a default export
import passport from 'passport';
import passportJWT from 'passport-jwt';
import express from 'express';

// Destructure the strategy and methods from passportJWT
const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;

const app = express();

// Controllers
import { pingTest, test } from '../v1/controllers/test.controller.js';

// Routers
import testRouter from '../v1/routes/test.routes.js';
import userRouter from '../v1/routes/user.routes.js';

// Define the JWT strategy
const passportStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'superSecret', // Secret key
  },
  (jwt_payload, next) => {
    console.log(jwt_payload);
    next(null, jwt_payload);
  }
);

// Initialize passport strategy
passport.use(passportStrategy);

// Handle browser OPTIONS requests
const handleOptionsReq = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Test routes
app.get('/test', test);
app.get('/test/ping', pingTest);

// Secured routes - authenticate using user JWT
app.use('/api', handleOptionsReq, passport.authenticate('jwt', { session: false }));
app.use('/api', testRouter);

// User routes
app.use('/user', userRouter);

export default app;
