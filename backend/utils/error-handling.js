// Send 404 Error if resource does not exist in db
const checkFor404NotFoundError = (resource, resourceNameAsString) => {
  if (!resource) {
    return res.status(404).json({
      message: `${resourceNameAsString} not found`,
      statusCode: 404
    });
  }
}

// Send 403 Forbidden Error if resource does not belong to user
const checkFor403ForbiddenError = (resource, resourceNameAsString) => {
  if (resource && resource.userId !== userId) {
    return res.status(403).json({
      message: `Forbidden, ${resourceNameAsString} must belong to user`,
      statusCode: 403
    })
  }
}

module.exports = { checkFor404NotFoundError, checkFor403ForbiddenError }
