// Export the catchAsyncErrors function
export const catchAsyncErrors = (theFunction) => {
  // Return a new function that will be used as a middleware
  return (req, res, next) => {
    // Call the passed asynchronous function (theFunction) with req, res, and next
    // Wrap the function call in Promise.resolve to handle both synchronous and asynchronous errors
    Promise.resolve(theFunction(req, res, next))
      // If the function throws an error or returns a rejected promise, catch it
      .catch(next); // Pass the error to the next middleware (usually the error handler)
  };
};
