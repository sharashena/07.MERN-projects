const getUniqueField = (products, field) => {
  const newArr = new Set(products?.map(product => product[field]));
  return ["all", ...newArr];
};

export { getUniqueField };
