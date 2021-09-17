const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const routes = require('./routes');
const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const app = express();
const port = 3000;

app.set('trust proxy', 1);

app.use(cookieSession({
      name: 'session',
      keys: ['ABCD', '1234'],
}))

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));

app.locals.siteName = 'ROUX Meeting';

app.use(async (req, res, next) => {
      try {
            const names = await speakerService.getNames();
            res.locals.speakerNames = names;
            return next();

      } catch(err) {
            return next(err);
      }
})

app.use('/', routes({
      feedbackService,
      speakerService
}));

app.use((req, res, next) => next(createError(404, 'File not found')))

app.use((err, req, res, next) => {
      console.error(err);
      res.locals.message = err.message;
      const status = err.status || 500;
      res.locals.status = status;
      res.status(status);
      res.render('./pages/error.ejs');
})


app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Listen from port ${port}`);

});
