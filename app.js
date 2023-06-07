const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/**
 * Global Middleware functions
 *
 */
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set security Middleware HTTP
//app.use(helmet.contentSecurityPolicy());
// Further HELMET configuration for Security Policy (CSP)
// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
//     contentSecurityPolicy: {
//       directives: {
//         baseUri: ["'self'"],
//         connectSrc: [
//           "'self'",
//           'data:',
//           'blob:',
//           'https://*.tiles.mapbox.com', //https://docs.mapbox.com/mapbox-gl-js/guides/browsers-and-testing/#csp-directives
//           'https://api.mapbox.com', //https://docs.mapbox.com/mapbox-gl-js/guides/browsers-and-testing/#csp-directives
//           'https://events.mapbox.com', //https://docs.mapbox.com/mapbox-gl-js/guides/browsers-and-testing/#csp-directives
//           'https://*.stripe.com',
//           'https://*.cloudflare.com/',
//           'https://bundle.js:*',
//           'ws://127.0.0.1:*/',
//         ],
//         defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
//         fontSrc: ["'self'", 'https:', 'data:'],
//         formAction: ["'self'"],
//         frameSrc: ["'self'", 'https://js.stripe.com'],
//         scriptSrc: [
//           "'self'",
//           'https:',
//           'http:',
//           'blob:',
//           'https://js.stripe.com',
//           'https://m.stripe.network',
//           'https://*.cloudflare.com',
//         ],
//         styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//         workerSrc: [
//           "'self'",
//           'data:',
//           'blob:', //https://docs.mapbox.com/mapbox-gl-js/guides/browsers-and-testing/#csp-directives
//           'https://m.stripe.network',
//         ],
//         objectSrc: ["'none'"],
//         childSrc: [
//           "'self'",
//           'blob:', //https://docs.mapbox.com/mapbox-gl-js/guides/browsers-and-testing/#csp-directives
//         ],
//         imgSrc: [
//           "'self'",
//           'data:',
//           'blob:', //https://docs.mapbox.com/mapbox-gl-js/guides/browsers-and-testing/#csp-directives
//         ],
//         upgradeInsecureRequests: [],
//       },
//     },
//   })
// );
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
    },
  })
);

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting middleware function that counts requests per IP address and blocks requests that exceed the rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  //Error message
  message:
    'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

//Body parser middleware - reading data from body into req.body
app.use(express.json()); //middleware
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution with whitelisted parameters like duration, ratingsQuantity, ratingsAverage, maxGroupSize, difficulty, price
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

/**
 ** Routes
 **
 */
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Middleware that will apply after reaching route that is not defined:
//so if someone make a mistake, this will present the error in JSON format.
app.all('*', (req, res, next) => {
  // const err = new Error(
  //   `Can't find ${req.originalUrl} on this server!`
  // );
  // err.status = 'Fail';
  // err.statusCode = 404;
  next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

module.exports = app;
