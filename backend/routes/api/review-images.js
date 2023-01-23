const router = require('express').Router();
const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');

// Delete an existing image for a Review
router.delete(
  '/:imageId',
  requireAuth,
  async (req, res, next) => {
    const imageId = +req.params.imageId;
    const userId = req.user.id;
    const reviewImage = await ReviewImage.findOne({
      where: { id: imageId }
    });

    // Return 404 Error if review image not found
    if (!reviewImage) {
      return res.status(404).json({
        message: "Review Image couldn't be found",
        statusCode: 404
      });
    }

    // Retreive review image belongs to
    const review = await reviewImage.getReview();

    if (review) {
      if (review.userId !== userId) {
        return res.status(403).json({
          message: "Review must belong to user in order to delete images",
          statusCode: 403
        });
      }
    } else {
      return res.status(404).json({
        message: "Review couldn't be found",
        statusCode: 404
      });
    }

    // Delete review image, checking for sequelize errors
    try {
      // Delete review image by id
      await ReviewImage.destroy({
        where: { id: imageId }
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
