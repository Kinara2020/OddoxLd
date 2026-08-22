import axios from 'axios';

export const convertCurrency = async (amount, from, to) => {
  const res = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_KEY}/pair/${from}/${to}/${amount}`
  );
  return res.data.conversion_result;
};