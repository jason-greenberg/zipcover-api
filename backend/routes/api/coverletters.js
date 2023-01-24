const router = require('express').Router()
const { CoverLetter } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
// const { requestCoverLetterFromGPT3 } = require('../../utils/gpt3');

// Get all cover letters of current user
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const userId = req.user.id;
    
    // Query db for user's coverletters
    const userCoverLetters = await CoverLetter.findAll({ where: { userId }});

    // Return cover letters
    res.json(userCoverLetters);
  }
);

module.exports = router;
