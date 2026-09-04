/**
 * Wraps an async route handler and automatically forwards any errors to Express error middleware.
 * Usage: router.post("/route", asyncHandler(myAsyncController))
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

export { asyncHandler };
