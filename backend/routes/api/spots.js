const router = require('express').Router();
const { query } = require('express');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { validateStartAndEndDates, ValidationError, BookingError } = require('../../utils/validation');

// Return all the spots owned (created) by the current user.
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const user = req.user;
    const query = { where: {} }
    query.where = { ownerId: user.id };

    const userSpots = await Spot.findAll(query);

    // Map each spot to an object with its average rating and preview image
    const spotsWithAvgRatingAndPreviewImage = await Promise.all(
      userSpots.map(async (spot) => {
        const spotId = spot.id;
        const previewImages = await SpotImage.findAll({ where: { spotId: spotId } });
        const spotJSON = spot.toJSON();
        if (previewImages.length) {
          spotJSON.previewImage = previewImages[0].url;
        } else {
          spotJSON.previewImage = null;
        }

        // Calculate the average rating for the spot
        const reviews = await Review.findAll({
          where: { spotId: spot.id }
        });
        const avgRating = reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length;
        spotJSON.avgRating = avgRating;

        return spotJSON;
      })
    );

    // Return the modified spotsJSON array in the response
    res.json({ Spots: spotsWithAvgRatingAndPreviewImage });
  }
);

// Return all reviews that belong to a spot specified by id
router.get(
  '/:spotId/reviews',
  async (req, res, next) => {
    const spotId = +req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    // Return 404 error if spot does not exist
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }

    const reviews = await Review.findAll({
      attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
      where: {
        spotId
      }
    });
    const reviewsJSON = JSON.parse(JSON.stringify(reviews));

    for (const review of reviewsJSON) {
      review.ReviewImages = await ReviewImage.scope('getReviewsView').findAll({
        where: { reviewId: review.id }
      });
      review.User = await User.scope('spotOwner').findOne({
        where: { id: review.userId }
      });
    }

    res.json({ Reviews: reviewsJSON });
  }
)

// Get all bookings for a spot based on the spot's id
router.get(
  '/:spotId/bookings',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);
    // Return 404 error if spot does not exist
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }

    const isSpotOwner = spot.ownerId === user.id;

    if (isSpotOwner) {
      const bookings = await spot.getBookings({
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
      });
      const bookingsJSON = JSON.parse(JSON.stringify(bookings))

      for (const booking of bookingsJSON) {
        const user = await User.findOne({
          attributes: ['id', 'firstName', 'lastName'], 
          where: booking.userId 
        });
        booking.User = user;
        booking.startDate = new Date(booking.startDate).toISOString().slice(0, 10); // format date output
        booking.endDate = new Date(booking.endDate).toISOString().slice(0, 10);
      }

      res.json({ Bookings: bookingsJSON })
    } else {
      const bookings = await spot.getBookings({
        attributes: ['spotId', 'startDate', 'endDate']
      });

      for (const booking of bookings) {
        booking.startDate = new Date(booking.startDate).toISOString().slice(0, 10); // format date output
        booking.endDate = new Date(booking.endDate).toISOString().slice(0, 10);
      }

      res.json({ Bookings: bookings })
    }
  }
);

// Returns the details of a spot specified by its id
router.get(
  '/:spotId',
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    if (spot) {
      const spotJSON = spot.toJSON();
      const reviews = await Review.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'averageStars']],
        where: { spotId },
        group: ['spotId']
      });

      // Add aggregated and lazy loaded properties to spot object numReviews, avgStarRating, SpotImages
      const previewImages = await spot.getSpotImages();
      spotJSON.numReviews = await Review.count({ where: { spotId }});
      if (previewImages.length) {
        spotJSON.previewImage = previewImages[0].url;
      } else {
        spotJSON.previewImage = null;
      }
      if (reviews.length) {
        spotJSON.avgStarRating = reviews[0].dataValues.averageStars;
      } else {
        spotJSON.avgStarRating = null;
      }
      spotJSON.SpotImages = await spot.getSpotImages();
      spotJSON.Owner = await spot.getUser({
        through: {
          attributes: []
        },
        scope: 'spotOwner'
      });

      return res.json(spotJSON);
    } else {
      res.status(404)
      return res.json({
        message: `Spot couldn't be found`,
        statusCode: 404
      });
    }
  }
)

// Return all spots
router.get(
  '/',
  async (req, res, next) => {
    let {
      page = 1,
      size = 20,
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice
    } = req.query;

    // Convert query parameters to numbers
    page = parseInt(page);
    size = parseInt(size);
    minLat = minLat ? parseFloat(minLat) : undefined;
    maxLat = maxLat ? parseFloat(maxLat) : undefined;
    minLng = minLng ? parseFloat(minLng) : undefined;
    maxLng = maxLng ? parseFloat(maxLng) : undefined;
    minPrice = minPrice ? parseFloat(minPrice) : undefined;
    maxPrice = maxPrice ? parseFloat(maxPrice) : undefined;
    
    // Validate query parameters
    const errors = {};
    if (page && (page < 1 || page > 10)) errors.page = "Page must be between 1 and 10";
    if (size && (size < 1 || size > 20)) errors.size = "Size must be between 1 and 20";
    if (minLat && (minLat < -90 || minLat > 90)) errors.minLat = "Minimum latitude is invalid";
    if (maxLat && (maxLat < -90 || maxLat > 90)) errors.maxLat = "Maximum latitude is invalid";
    if (minLng && (minLng < -180 || minLng > 180)) errors.minLng = "Minimum longitude is invalid";
    if (maxLng && (maxLng < -180 || maxLng > 180)) errors.maxLng = "Maximum longitude is invalid";
    if (minPrice && (minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
    if (maxPrice && (maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

    // If there are any validation errors, return a 400 response with the errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Validation error",
        statusCode: 400,
        errors
      });
    }

    const where = {};
    if (minLat) where.lat = { [Op.gte]: minLat };
    if (maxLat) where.lat = { [Op.lte]: maxLat };
    if (minLng) where.lng = { [Op.gte]: minLng };
    if (maxLng) where.lng = { [Op.lte]: maxLng };
    if (minPrice) where.price = { [Op.gte]: minPrice };
    if (maxPrice) where.price = { [Op.lte]: maxPrice };

    // Query all spots
    const spots = await Spot.findAll({
      where,
      limit: size,
      offset: (page - 1) * size,
      order: [['createdAt', 'DESC']]
    });

    // Map each spot to an object with its average rating and preview image
    const spotsWithAvgRatingAndPreviewImage = await Promise.all(
      spots.map(async (spot) => {
        const spotId = spot.id;
        const previewImages = await SpotImage.findAll({ where: { spotId: spotId } });
        const spotJSON = spot.toJSON();
        if (previewImages.length > 0) {
          spotJSON.previewImage = previewImages[0].url;
        } else {
          spotJSON.previewImage = null;
        }

        // Calculate the average rating for the spot
        const reviews = await Review.findAll({
          where: { spotId: spot.id }
        });
        const avgRating = reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length;
        spotJSON.avgRating = avgRating;

        return spotJSON;
      })
    );

    // Return the modified spotsJSON array in the response
    res.json({ Spots: spotsWithAvgRatingAndPreviewImage, page, size });
});

// Create and return a new image for a spot specified by id
router.post(
  '/:spotId/images',
  requireAuth,
  async (req, res, next) => {
    const { url, preview } = req.body;
    const { user } = req;
    const userId = user.id;
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    // Return 404 Error if spot not found
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }
    // Return 403 Not authorized Error if spot does not belong to current user
    if (spot.ownerId !== userId) {
      res.status(401);
      return res.json({
        message: "Forbidden",
        statusCode: 403
      })
    }

    const newSpotImage = await SpotImage.create({
      spotId,
      url,
      preview
    });
    // return the new spot image using default scope (not applied to above instance)
    const responseSpotImage = await SpotImage.findOne({
      where: {
        spotId,
        url,
        preview
      }
    });

    res.json(responseSpotImage);
  }
);

// Create and return a new booking from a spot specified by id.
router.post(
  '/:spotId/bookings',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const userId = user.id;
    const { startDate, endDate } = req.body;
    const spotId = +req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    // Return 404 Error if spot not found
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
      });
    }

    // Return 403 Not authorized Error if spot is OWNED by current user
    if (spot.ownerId === userId) {
      return res.status(401).json({
        message: "Owner cannot book their own rental property",
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
      // Validate startDate and endDate
      await validateStartAndEndDates(startDate, endDate, spotId);
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

    try {
      // Create booking
      const booking = await Booking.create({
        userId,
        spotId,
        startDate,
        endDate
      });
      
      const mostRecentBooking = await Booking.findOne({
        where: {
          userId: user.id,
          spotId: spot.id
        },
        attributes: ['id', 'userId', 'spotId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        order: [
          ['createdAt', 'DESC']
        ],
        limit: 1
      });
      return res.status(201).json(mostRecentBooking);      
    } catch (error) {
      console.error('Error occurred when creating booking:', error);
      return res.status(500).json({
        message: "An unexpected error occurred",
        statusCode: 500,
        error
      });
    }
  }
);

// Create and return a review for a spot specified by id
router.post(
  '/:spotId/reviews',
  requireAuth,
  async (req, res, next) => {
    const spotId = +req.params.spotId;
    const userId = req.user.id;
    const { review, stars } = req.body;
    const spot = await Spot.findByPk(spotId);

    // Return 404 Error if spot not found
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
      });
    }

    // Return 403 Error if user has already reviewed spot
    const userReviews = await Review.findAll({
      where: { spotId, userId }
    });
    if (userReviews.length) {
      return res.status(403).json({
        message: "User already has a review for this spot",
        statusCode: 403
      });
    }

    // Return 403 Not authorized Error if spot is OWNED by current user
    if (spot.ownerId === userId) {
      return res.status(403).json({
        message: "Spot cannot be reviewed by the owner",
        statusCode: 403
      });
    }

    // Check if review and stars exist in request body
    if( req.body.review === undefined || req.body.stars === undefined ){
      return res.status(400).json({
        message: 'Validation error',
        statusCode: 400,
        errors: {
          review: req.body.review !== undefined ? undefined : 'Review text is required',
          stars: req.body.stars !== undefined ? undefined : 'Stars are required'
        }
      });
    }

    // Create review, checking for validation errors
    try {
      await Review.create({ review, stars, spotId, userId }, { defaults: {} });
      const savedReview = await Review.scope('createReview').findOne({
        where: { review, userId, spotId }
      });
      res.status(201).json(savedReview);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        res.status(400).json({
          message: 'Validation error',
          statusCode: 400,
          errors
        });
      } else {
        console.error(error);
        res.status(500).json({
          message: 'An error occurred',
          statusCode: 500
        });
      }
    }        
  }
);

// Create and return a new spot
router.post(
  '/',
  requireAuth,
  async (req, res, next) => {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    } = req.body;
    const { user } = req;
    const ownerId = user.id;

    try {
      const newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      });

      res.status(201)
      res.json(newSpot);
    } catch(e) {
      const errorResponse = {
        message: 'Validation Error',
        statusCode: 400,
        errors: {}
      };

      if (e.name === 'SequelizeValidationError') {
        e.errors.forEach(error => {
          errorResponse.errors[error.path] = error.message;
        });
      } else {
        errorResponse.errors.server = 'Server error';
      }

      res.status(errorResponse.statusCode);
      res.json(errorResponse);
    }
  }
);

// Updates and returns an existing spot
router.put(
  '/:spotId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const userId = user.id;
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    // Return 404 Error if spot not found
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }
    // Return 403 Not authorized Error if spot does not belong to current user
    if (spot.ownerId !== userId) {
      res.status(401);
      return res.json({
        message: "Forbidden",
        statusCode: 403
      })
    }

    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    } = req.body;

    const expectedFields = [
      'address',
      'city',
      'state',
      'country',
      'lat',
      'lng',
      'name',
      'description',
      'price'
    ];
    const missingFields = expectedFields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
      res.status(400);
      return res.json({
        message: 'Validation Error',
        statusCode: 400,
        errors: {
          missingFields: missingFields.map(field => `${field} is required`)
        }
      });
    }

    try {
      await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      })

      return res.json(spot);
    } catch(e) {
      const errorResponse = {
        message: 'Validation Error',
        statusCode: 400,
        errors: {}
      };

      if (e.name === 'SequelizeValidationError') {
        e.errors.forEach(error => {
          errorResponse.errors[error.path] = error.message;
        });
      } else {
        errorResponse.errors.server = 'Server error';
      }

      res.status(errorResponse.statusCode);
      res.json(errorResponse);
    }
  }
);

router.delete(
  '/:spotId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const userId = user.id;
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    // Return 404 Error if spot not found
    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }
    // Return 403 Not authorized Error if spot does not belong to current user
    if (spot.ownerId !== userId) {
      res.status(401);
      return res.json({
        message: "Forbidden",
        statusCode: 403
      })
    }

    await spot.destroy();
    res.json({
      message: "Successfully deleted",
      statusCode: 200
    })
  }
)

module.exports = router;
