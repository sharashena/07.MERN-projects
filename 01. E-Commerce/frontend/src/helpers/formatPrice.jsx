const formatPrice = price => {
  const formatNumber = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "GEL",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
  }).format(price);

  return `${formatNumber.replace("GEL", "")} ₾`;
};

export { formatPrice };
