const router = require('express').Router()
const { CoverLetter } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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

// Create new cover letter
router.post(
  '/',
  requireAuth,
  async (req, res, next) => {
    const userId = req.user.id;

    
  }
)

module.exports = router;
