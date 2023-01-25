const router = require('express').Router();
const { Resume, Application, CoverLetter } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { requestCoverLetterFromGPT3 } = require('../../utils/gpt3');

// Get all resumes of current user
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const userId = req.user.id;
    
    // Query db for user's coverletters
    const userResumes = await Resume.findAll({ where: { userId }});

    // Return cover letters
    res.json(userResumes);
  }
);


// Create new Cover Letter by resume id
router.post(
  '/:id/coverletters',
  requireAuth,
  async (req, res, next) => {
    const userId = req.user.id;
    const { jobDescription } = req.body;
    const resumeId = req.params.id;
    const resume = await Resume.findByPk(+resumeId);
    
    // 404 Error if resume does not exist in db
    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
        statusCode: 404
      });
    }
    
    // 403 Forbidden Error if attached resume does not belong to user
    if (resume && resume.userId !== userId) {
      return res.status(403).json({
        message: 'Forbidden, resume must belong to user',
        statusCode: 403
      })
    }
    
    // call gpt api
    try {
      const data = await requestCoverLetterFromGPT3(resume, jobDescription);
      const letterText = data.choices[0].text;
      const engine = data.model;
      
      // Create new coverletter in db
      const newCoverLetter = await CoverLetter.create({
        userId,
        letterText,
        engine,
        jobDescription
      });
      
      // Create new application to coincide with new coverletter and resume
      await Application.create({
        userId,
        resumeId: +resumeId,
        coverLetterId: newCoverLetter.id
      });
      
      // Retreive new application
      const coverLetterId = newCoverLetter.id
      const newApplication = await Application.findOne({
        where: { resumeId, coverLetterId },
        attributes: {
          include: ['id']
        }
      });
      
      res.json({
        CoverLetter: newCoverLetter,
        Application: newApplication
      });
    } catch (error) {
      res.json(error);
    }
    
  }
)
  
// Create new Resume
router.post(
  '/',
  requireAuth,
  async (req, res, next) => {
    const userId = +req.user.id;
    const { resumeText, positionType, skillLevel } = req.body;

    
  }
)

  module.exports = router;
  