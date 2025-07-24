export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error something went wrong";

  res.status(status).json({
    status: "error",
    message,
  });
};
