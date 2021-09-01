const errorHandler = (err, req, res, next) => {
  // Console Log for dev
  console.log(err.stack.red);

  res.status(500).json({
    success: false,
    error: err.message,
  });
};

module.exports = errorHandler;
