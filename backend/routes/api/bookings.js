const router = require('express').Router();
const { requireAuth } = require('../../utils/auth');
const { validateStartAndEndDates, ValidationError, BookingError } = require('../../utils/validation');
const { Booking, Spot, User } = require('../../db/models');
const sequelize = require('sequelize');

// Get all of the current user's bookings
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const userId = user.id;
    const bookings = await Booking.findAll({ attributes: ['id', 'userId', 'spotId', 'startDate', 'endDate', 'createdAt', 'updatedAt'], where: { userId } });
    const bookingsJSON =  JSON.parse(JSON.stringify(bookings));
    
    for (const booking of bookingsJSON) {
      const spot = await Spot.scope('bookingView').findOne({ where: { id: booking.spotId } });
      const previewImage = await spot.getSpotImages();
      const spotJSON = spot.toJSON();
      spotJSON.previewImage = previewImage[0].url;
      booking.Spot = spotJSON;
      booking.startDate = new Date(booking.startDate).toISOString().slice(0, 10); // format date output
      booking.endDate = new Date(booking.endDate).toISOString().slice(0, 10);
    }

    const response = bookingsJSON.map(booking => ({
      id: booking.id,
      spotId: booking.spotId,
      Spot: booking.Spot,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }))

    res.json({ Bookings: response });
  }
);

// Update and return an existing booking
router.put(
  '/:bookingId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const userId = user.id;
    const bookingId = +req.params.bookingId;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findOne({
      where: { id: bookingId }
    });

    // Return 404 Error if booking not found
    if (!booking) {
      res.status(404);
      return res.json({
        message: "Booking couldn't be found",
        statusCode: 404
      });
    }

    // Return 403 Forbidden if booking does not belong to user
    if (booking.userId !== userId) {
      res.status(403);
      return res.json({
        message: 'Forbidden',
        statusCode: 403
      });
    }

    // Check if startDate and endDate exist in request body
    if( req.body.startDate === undefined || req.body.endDate === undefined ){
      return res.status(400).json({
        message: 'Validation error',
        statusCode: 400,
        errors: {
          startDate: req.body.startDate !== undefined ? undefined : 'Start date is required',
          endDate: req.body.endDate !== undefined ? undefined : 'End date is required'
        }
      });
    }

    try {
      // Validate new startDate and endDate
      await validateStartAndEndDates(startDate, endDate, booking.spotId);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          errors: error.errors
        });
      } else if (error instanceof BookingError) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          statusCode: 403,
          errors: error.errors
        });
      } else {
        // Return 500 Internal Server Error for unexpected errors
        return res.status(500).json({
          message: "An unexpected error occurred",
          statusCode: 500,
          error
        });
      }
    }

    const parsedStartDate = new Date(startDate.split('-').join('/')).toISOString(); //fixes JS bug that makes date one day off
    const parsedEndDate = new Date(endDate.split('-').join('/')).toISOString();

    try {
      await Booking.update({
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        spotId: booking.spotId
      }, { where: { id: bookingId }
      });

      const updatedBooking = await Booking.findOne({
        attributes: ['id', 'userId', 'spotId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        where: { id: bookingId }
      });

      res.json(updatedBooking);
    } catch(e) {
      const errorResponse = {
        message: 'Validation Error',
        statusCode: 400,
        errors: {}
      };

      if (e.name === 'SequelizeValidationError') {
        e.errors.forEach(error => {
          errorResponse.errors[error.path] = error.message;
          if (
            error.message.includes('Start date conflicts')
            || error.message.includes('End date conflicts')
          ) {
            errorResponse.message = 'Sorry, this spot is already booked for the specified dates';
            errorResponse.statusCode = 403;
          }
        });
      } else {
        errorResponse.errors.server = 'Server error';
      }

      res.status(errorResponse.statusCode);
      res.json(errorResponse);
    }
  }
);

// Delete an existing booking
router.delete(
  '/:bookingId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const userId = user.id;
    const bookingId = +req.params.bookingId;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findOne({
      where: { id: bookingId }
    });

    // Return 404 Error if booking not found
    if (!booking) {
      res.status(404);
      return res.json({
        message: "Booking couldn't be found",
        statusCode: 404
      });
    }

    const spot = await Spot.findOne({
      attributes: ['id', 'ownerId'],
      where: { id: booking.spotId }
    });
    const ownerId = spot.ownerId;

    // Return 403 Forbidden if booking does not belong to user, or if user is not the spot owner
    if (booking.userId !== userId && ownerId !== userId) {
      res.status(403);
      return res.json({
        message: 'Forbidden',
        statusCode: 403
      });
    }

    // Return 403 Error if booking has already started
    if (booking.startDate < new Date()) {
      res.status(403);
      return res.json({
        message: "Bookings that have been started can't be deleted",
        statusCode: 403
      });
    }

    try {
      await Booking.destroy({
        where: { id: bookingId }
      });
      res.json({
        message: "Successfully deleted",
        statusCode: 200
      });
    } catch (error) {
      res.status(500);
      res.json({
        message: "There was an error deleting the booking",
        statusCode: 500,
        error: error
      });
    }

  }
);


module.exports = router;
