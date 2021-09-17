const express = require('express');

const speakerRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = (params) => {
      const { speakerService } = params;


      router.get('/', async (req, res, next) => {
            try {
                  const topSpeakers = await speakerService.getList();
                  return res.render('layout/', { pageTitle: 'Welcome', template: 'index', topSpeakers});
            } catch(err) {
                  return next(err);
            }
      });

      router.use('/speakers', speakerRoute(params));
      router.use('/feedback', feedbackRoute(params));
      return router;
};