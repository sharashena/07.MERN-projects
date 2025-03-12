import axios from "axios";

const getExchangeRate = async (fromCurrency, toCurrency) => {
  const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${toCurrency}`;

  const { data } = await axios.get(url);
  return data.conversion_rates[fromCurrency];
};

export { getExchangeRate };
