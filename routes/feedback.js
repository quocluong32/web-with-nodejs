const { request } = require('express');
const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();
      const errors = req.session.feedback.errors || null;
      const successMessage = req.session.successMessage || null;
      req.session.successMessage = null;
      req.session.feedback = {};
      return res.render('./layout/index.ejs', {
        pageTitle: 'feed back',
        template: 'feedback.ejs',
        feedback,
        errors,
        successMessage
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post(
    '/',
    [
      check('name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A name with at least 3 character is required'),
      check('email').trim().isEmail().normalizeEmail().withMessage('A valid email is requested'),
      check('title')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A title with at least 3 characters is required.'),
      check('message')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A valid message is at least 3 characters'),
    ],
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
            req.session.feedback = {
                  errors : errors.array(),
            }
            return res.redirect('/feedback');
      }

      const { name, email, title, message } = req.body;
      feedbackService.addEntry(name, email, title, message);
      req.session.successMessage = 'Thank you for feedback!';
      return res.redirect('/feedback');
    }
  );

  return router;
};
