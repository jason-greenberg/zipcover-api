const router = require('express').Router();
const { Resume } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// Create new Cover Letter by resume id
router.post(
  '/:id/coverletters',
  requireAuth,
  async (req, res, next) => {
    
  }
)

module.exports = router;
