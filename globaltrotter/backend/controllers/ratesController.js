import { convertCurrency } from '../services/exchangeRateService.js';

export const getRateMultiplier = async (req, res) => {
  const { from = 'USD', to = 'USD' } = req.query;
  
  if (from === to) {
    return res.json({ multiplier: 1 });
  }

  try {
    // We request the conversion for 1 unit to get the multiplier
    const multiplier = await convertCurrency(1, from, to);
    res.json({ multiplier });
  } catch (error) {
    console.error("Exchange Rate Error:", error.message);
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
};
