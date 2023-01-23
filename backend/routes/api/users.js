const router = require('express').Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a first name'),
  check('lastName')
    .exists({ checkFalsy: true})
    .withMessage('Please provide a last name'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    try {
      const user = await User.signup({ firstName, lastName, email, username, password });
      await setTokenCookie(res, user);
      const userJSON = user.toJSON()
      userJSON.token = req.headers['xsrf-token'];
      return res.json({
        user: userJSON
      });
    } catch (error) {
      if (error.original && error.original.code === '23505') {
        // Handle unique constraint error (code 23505)
        const field = error.original.constraint;
        const formattedField = field.includes('_') ? field.split('_')[1] : field; // Format field for readability from Postgres Error Object eg. "Users_username_key" becomes "username"

        return res.status(403).json({
          message: 'User already exists',
          statusCode: 403,
          errors: {
            [formattedField]: `User with that ${formattedField} already exists`
          }
        });
      } else if (error.errors) {
        // Handle validation error
        return res.status(400).json({
          message: 'Validation error',
          statusCode: 400,
          errors: error.errors.reduce((errors, err) => {
            errors[err.path] = err.message;
            return errors;
          }, {})
        });
      } else {
        // Handle server error
        return res.status(500).json({
          message: 'Server error',
          statusCode: 500
        });
      }
    }
  }
);

module.exports = router;
