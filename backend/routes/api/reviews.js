const router = require('express').Router();
const { requireAuth } = require('../../utils/auth');
const { validateUrl } = require('../../utils/validation');
const { Spot, SpotImage, Review, ReviewImage } = require('../../db/models');

// Return all reviews written by the current user
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const user = req.user;
    const userId = user.id;

    const reviews = await Review.findAll({
      attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
      where: {
        userId
      }
    });

    // Convert the spots array to a plain JavaScript object
    const reviewsJSON = JSON.parse(JSON.stringify(reviews));

    // Iterate over the spotsJSON array and add avgRating properties to each spot object
    for (const review of reviewsJSON) {
      const spot = await Spot.scope('bookingView').findOne({ where: { id: review.spotId } });
      const previewImages = await SpotImage.findAll({ where: { spotId: spot.id } });
      const spotJSON = spot.toJSON();
      if (previewImages.length) {
        spotJSON.previewImage = previewImages[0].url;
      } else {
        spotJSON.previewImage = null;
      }
      review.Spot = spotJSON;
      review.User = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      }
      review.ReviewImages = await ReviewImage.scope('getReviewsView').findAll({
        where: { reviewId: review.id }
      });
    }

    res.json({ Reviews: reviewsJSON });
  }
);

// Create and return a new image for a review specified by id
router.post(
  '/:reviewId/images',
  requireAuth,
  validateUrl,
  async (req, res, next) => {
    const reviewId = +req.params.reviewId;
    const userId = req.user.id;
    const { url } = req.body;
    const review = await Review.findOne({
      where: { id: reviewId }
    });

    // Return 404 Error if review not found
    if (!review) {
      return res.status(404).json({
        message: "Review couldn't be found",
        statusCode: 404
      });
    }

    // Return 403 Not authorized Error if review does not belong to user
    if (review.userId !== userId) {
      return res.status(403).json({
        message: "Review must belong to user in order to add images",
        statusCode: 403
      });
    }

    // Check for existing review image with the same url and reviewId combination
    const existingReviewImage = await ReviewImage.findOne({
      where: { reviewId, url }
    });
    if (existingReviewImage) {
      return res.status(409).json({
        message: 'Images cannot be duplicates or must have unique urls / file name for each review',
        statusCode: 409
      });
    }

    // Return 403 Error if max of 10 images already reached
    const allReviewImages = await ReviewImage.count({
      where: { reviewId }
    });
    if (allReviewImages >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
        statusCode: 403
      });
    }

    // Add a review image, checking for validation errors
    try {
      await ReviewImage.create({ url, reviewId });
      const savedReviewImage = await ReviewImage.scope('getReviewsView').findOne({
        where: { reviewId, url }
      });
      res.status(201).json(savedReviewImage);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({
          message: 'Images cannot be duplicates or must have unique urls / file names',
          statusCode: 409
        });
      } else if (error.name === 'SequelizeValidationError') {
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

// Update and return an existing review
router.put(
  '/:reviewId',
  requireAuth,
  async (req, res, next) => {
    const reviewId = +req.params.reviewId;
    const userId = req.user.id;
    const { review, stars } = req.body;
    const reviewToEdit = await Review.findOne({
      where: { id: reviewId }
    });

    // Return 404 Error if review not found
    if (!reviewToEdit) {
      return res.status(404).json({
        message: "Review couldn't be found",
        statusCode: 404
      });
    }

    // Return 403 Not authorized Error if review does not belong to user
    if (reviewToEdit.userId !== userId) {
      return res.status(403).json({
        message: "Review must belong to user in order to edit",
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
      await Review.update({ review, stars }, { where: { id: reviewId } });
      const savedReview = await Review.scope('createReview').findOne({
        where: { id: reviewId }
      });
      res.status(200).json(savedReview);
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

// Delete an existing review
router.delete(
  '/:reviewId',
  requireAuth,
  async (req, res, next) => {
    const reviewId = +req.params.reviewId;
    const userId = req.user.id;

    const reviewToDelete = await Review.findOne({
      where: { id: reviewId }
    });

    // Return 404 Error if review not found
    if (!reviewToDelete) {
      return res.status(404).json({
        message: "Review couldn't be found",
        statusCode: 404
      });
    }

    // Return 403 Not authorized Error if review does not belong to user
    if (reviewToDelete.userId !== userId) {
      return res.status(403).json({
        message: "Review must belong to user in order to delete",
        statusCode: 403
      });
    }
    // Delete review, checking for sequelize errors
    try {
      // Delete all review images that have a foreign key reference to the review
      await ReviewImage.destroy({
        where: { reviewId: reviewId }
      });

      // Then delete the review itself
      await Review.destroy({
        where: { id: reviewId }
      });

      res.json({
        message: "Successfully deleted",
        statusCode: 200
      })
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

module.exports = router;
