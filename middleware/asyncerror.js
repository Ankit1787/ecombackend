exports.Errormiddleware = (errorFunc) => {
  return (req, res, next) => {
    Promise.resolve(errorFunc(req, res, next)).catch(next);
  };
};
