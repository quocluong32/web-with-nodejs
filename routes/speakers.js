const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const topSpeakers = await speakerService.getList();
      return res.render('./layout/index.ejs', {
        pageTitle: 'Speakers List',
        template: 'speakers',
        topSpeakers,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (req, res, next) => {
    try {
      const { shortname } = req.params;
      const speaker = await speakerService.getSpeaker(shortname);
      const artWork = await speakerService.getArtworkForSpeaker(shortname);

      return res.render('./layout/index.ejs', {
        pageTitle: 'Speakers Info',
        template: 'speaker_info',
        speaker,
        artWork,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
