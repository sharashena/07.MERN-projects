const { StatusCodes } = require("http-status-codes");

const errorMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "internal server error",
  };
  if (typeof customError.msg === "string") {
    try {
      customError.msg = JSON.parse(customError.msg);
    } catch (error) {}
  }
  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = Object.values(err.errors)
      .map(field => field.message)
      .join(", ");
  }
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `${Object.keys(err.keyValue).map(
      item => item
    )} already exists`;
  }
  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `product doesn't exists with param id: ${err.value}`;
  }

  return res.status(customError.statusCode).json({ errors: customError });
};

module.exports = errorMiddleware;
