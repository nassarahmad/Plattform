const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
      });

      if (!parsed.success) {
        const errors = parsed.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({ success: false, message: 'Invalid data provided', errors });
      }

      req.body = parsed.data.body;
      req.query = parsed.data.query;
      req.params = parsed.data.params;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validate;