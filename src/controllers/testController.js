const getTest = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Route is working! Ready for your idea.'
  });
};

module.exports = { getTest };

