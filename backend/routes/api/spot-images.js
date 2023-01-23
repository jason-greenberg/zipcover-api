const router = require('express').Router();
const { requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');

// Delete an existing image for a spot
router.delete(
  '/:imageId',
  requireAuth,
  async (req, res, next) => {
    const imageId = +req.params.imageId;
    const userId = req.user.id;
    const spotImage = await SpotImage.scope('spotImageView').findByPk(imageId);

    // Return 404 Error if spot image not found
    if (!spotImage) {
      return res.status(404).json({
        message: "Spot Image couldn't be found",
        statusCode: 404
      });
    }

    // Retreive spot the image belongs to
    const spotId = spotImage.spotId;
    const spot = await Spot.findByPk(spotId);

    // Return 403 Not authorized Error if spot image does not belong to user
    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: "Spot must belong to user in order to delete images",
        statusCode: 403
      });
    }

    // Delete spot image, checking for sequelize errors
    try {
      // Delete spot image by id
      await SpotImage.destroy({
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
