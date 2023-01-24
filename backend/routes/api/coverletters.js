const router = require('express').Router()
const { CoverLetter, Resume } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { requestCoverLetterFromGPT3 } = require('../../utils/gpt3');

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
    const { resumeId } = req.body;

    const resume = await Resume.findByPk(+resumeId);
    // 403 Forbidden Error if attached resume does not belong to user
    if (resume && resume.userId !== userId) {
      return res.status(403).json({
        message: 'Forbidden, resume must belong to user',
        statusCode: 403
      })
    }

    // call gpt api
    try {
      const data = await requestCoverLetterFromGPT3(resume, 'say hello')
      res.json(data.choices[0].text);
    } catch (error) {
      res.json(error.response);
    }

  }
)

module.exports = router;
