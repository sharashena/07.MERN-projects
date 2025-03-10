const addProductsValidation = ({
  name,
  company,
  category,
  price,
  description,
  stock,
}) => {
  const errors = {};
  const companies = ["marcos", "liddy", "ikea", "caressa"];
  const categories = [
    "living room",
    "kitchen",
    "bedroom",
    "dining",
    "office",
    "kids",
  ];

  if (!name) {
    errors.name = "name is required*";
  } else if (name.length > 25) {
    errors.name = "name can't be more than 25 characters*";
  } else if (name.length < 3) {
    errors.name = "name can't be less than 3 characters*";
  }

  if (!company) {
    errors.company = "company is required*";
  } else if (!companies.includes(company)) {
    errors.company = `${company} isn't valid company*`;
  }

  if (!category) {
    errors.category = "category is required*";
  } else if (!categories.includes(category)) {
    errors.category = `${category} isn't valid category*`;
  }

  if (!Number(price)) {
    errors.price = "price is required*";
  }
  if (!Number(stock)) {
    errors.stock = "stock is required*";
  }

  if (description.length > 500) {
    errors.description = "description can't be more than 500 characters*";
  }

  return errors;
};

export default addProductsValidation;
