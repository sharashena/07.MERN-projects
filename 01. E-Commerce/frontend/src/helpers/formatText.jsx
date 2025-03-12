const formatText = (str, n) => {
  return str.length > 150 ? str.slice(0, n) + "..." : str;
};

export { formatText };
