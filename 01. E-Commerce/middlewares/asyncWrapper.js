const asyncWrapper = func => {
  return (req, res, next) => {
    return func(req, res).catch(next);
  };
};

module.exports = asyncWrapper;
