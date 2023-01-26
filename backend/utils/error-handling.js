const express = require('express');

// Send 404 Error if resource does not exist in db
const send404NotFoundError = (res, resourceNameStr = 'resource') => {
  return res.status(404).json({
    message: `${resourceNameStr[0].toUpperCase() + resourceNameStr.slice(1)} not found`,
    statusCode: 404
  });
}

// Send 403 Forbidden Error if resource does not belong to user
const send403ForbiddenError = (res, resourceNameStr = 'resource') => {
  return res.status(403).json({
    message: `Forbidden, ${resourceNameStr.toLowerCase()} must belong to user`,
    statusCode: 403
  })
}

module.exports = { send404NotFoundError, send403ForbiddenError }
