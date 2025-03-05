const commentsValidations = data => {
  const errors = {};

  if (!data.comment) {
    errors.comment = "comment is required";
  } else if (data.comment.length > 300) {
    errors.comment = "comment can't be more than 300 characters";
  }

  return errors;
};

module.exports = commentsValidations;
