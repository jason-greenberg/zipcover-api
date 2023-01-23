const { validationResult } = require('express-validator');
const { Booking } = require('../db/models');
const { Op } = require('sequelize');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};

// Custom error objects to be recognized in catch block of endpoint
class BookingError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
    this.name = 'BookingError';
  }
}
class ValidationError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

// Custom booking request body validation function
async function validateStartAndEndDates(startDate, endDate, spotId) {
  const dateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
  const errors = {};
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if startDate comes before endDate
  if (start >= end) {
    errors.endDate = 'endDate cannot come before startDate';
  }

  // Check if startDate and endDate are in the future
  if (start < new Date()) {
    errors.startDate = 'Start date must be in the future';
  }
  if (end < new Date()) {
    errors.endDate = 'End date must be in the future';
  }

  // Check if startDate and endDate are in the correct format
  if (!dateRegex.test(startDate)) {
    errors.startDate = 'Start date must be in the format YYYY-MM-DD and be a valid date';
  }
  if (!dateRegex.test(endDate)) {
    errors.endDate = 'End date must be in the format YYYY-MM-DD and be a valid date';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  // Check if the spot is available for the specified dates with efficient query
  const existingBookings = await Booking.findAll({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.lte]: endDate
          },
          endDate: {
            [Op.gte]: startDate
          }
        },
        {
          startDate: {
            [Op.lte]: startDate
          },
          endDate: {
            [Op.gte]: startDate
          }
        },
        {
          startDate: {
            [Op.lte]: endDate
          },
          endDate: {
            [Op.gte]: endDate
          }
        }
      ]
    }
  });

  if (existingBookings.length) {
    let startDateConflict = false;
    let endDateConflict = false;
    for (const booking of existingBookings) {
      if (booking.startDate <= startDate && booking.endDate >= startDate) {
        startDateConflict = true;
      }
      if (booking.startDate <= endDate && booking.endDate >= endDate) {
        endDateConflict = true;
      }
    }
    if (startDateConflict && endDateConflict) {
      errors.startDate = 'Start date conflicts with an existing booking';
      errors.endDate = 'End date conflicts with an existing booking';
    } else if (startDateConflict) {
      errors.startDate = 'Start date conflicts with an existing booking';
    } else if (endDateConflict) {
      errors.endDate = 'End date conflicts with an existing booking';
    }
    throw new BookingError(errors);
  }
}

// Custom middleware function to check the type of the `url` field
const validateUrl = (req, res, next) => {
  if (typeof req.body.url !== 'string') {
    return res.status(400).json({
      message: "Validation error",
      statusCode: 400,
      errors: {
        url: "Review must be a string"
      }
    });
  }
  next();
}


module.exports = {
  handleValidationErrors,
  validateStartAndEndDates,
  validateUrl,
  ValidationError,
  BookingError
};
