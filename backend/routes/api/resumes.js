const router = require('express').Router();
const { Resume, Application, CoverLetter } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { send404NotFoundError, send403ForbiddenError } = require('../../utils/error-handling');
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
      send404NotFoundError(res, 'resume');
      return;
    }
    
    // 403 Forbidden Error if attached resume does not belong to user
    if (resume.userId !== userId) {
      send403ForbiddenError(res, 'resume');
      return;
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


    // Create new resume in db
    try {
      const newResume = await Resume.create({
        userId,
        resumeText,
        positionType,
        skillLevel
      });

      res.json(newResume);
    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: 'Error adding resume to database',
        statusCode: 400
      });
    }
  }
);

module.exports = router;
  