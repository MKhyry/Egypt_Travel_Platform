const Joi = require('joi');

/**
 * Validate request using Joi schemas for body, params, query
 * @param {Object} schema - { body?, params?, query? } Joi schemas
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(d => d.message));
      } else {
        req.body = value;
      }
    }

    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(d => d.message));
      } else {
        req.params = value;
      }
    }

    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(d => d.message));
      } else {
        req.query = value;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

module.exports = validate;
