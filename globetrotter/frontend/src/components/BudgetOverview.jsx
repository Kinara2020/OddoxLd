import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, TrendingUp, Sparkles, RefreshCw, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { discoveryAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function BudgetOverview({ tripId, stops = [] }) {
  const { currency } = useAuth();
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Currency conversion state
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [convertedTotal, setConvertedTotal] = useState(null);
  const [converting, setConverting] = useState(false);

  // Compute total and category breakdown locally if needed or fetch
  useEffect(() => {
    async function loadBudget() {
      if (!tripId) return;
      setLoading(true);
      try {
        const res = await discoveryAPI.getBudget(tripId);
        setBudgetData(res.data);
      } catch (err) {
        console.error('Budget view error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBudget();
  }, [tripId, stops]);

  // Calculate totals from stops if view is empty
  const computedTotal = stops.reduce((acc, stop) => {
    const stopTotal = (stop.trip_activities || []).reduce((sum, act) => sum + (Number(act.cost) || 0), 0);
    return acc + stopTotal;
  }, 0);

  const totalCost = budgetData?.total_activity_cost != null ? budgetData.total_activity_cost : computedTotal;

  // Category counts
  const categoryTotals = {
    tourism: 0,
    catering: 0,
    entertainment: 0,
    leisure: 0,
    general: 0
  };

  stops.forEach((stop) => {
    (stop.trip_activities || []).forEach((act) => {
      const cat = (act.activities?.category || 'general').toLowerCase();
      const cost = Number(act.cost) || 0;
      if (categoryTotals[cat] != null) {
        categoryTotals[cat] += cost;
      } else {
        categoryTotals.general += cost;
      }
    });
  });

  const handleConvert = async (toCurr) => {
    setTargetCurrency(toCurr);
    setConverting(true);
    try {
      const res = await discoveryAPI.convertCurrency(totalCost, currency, toCurr);
      setConvertedTotal(res.data.result);
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setConverting(false);
    }
  };

  const getCatColor = (cat) => {
    switch (cat) {
      case 'tourism':
        return 'from-indigo-500 to-indigo-600';
      case 'catering':
        return 'from-amber-500 to-amber-600';
      case 'entertainment':
        return 'from-purple-500 to-purple-600';
      case 'leisure':
        return 'from-emerald-500 to-emerald-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Cost */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Activity Budget
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currency} {totalCost.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Calculated across {stops.length} cities & {stops.reduce((a, s) => a + (s.trip_activities?.length || 0), 0)} activities
          </p>
        </div>

        {/* Currency Converter Card */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden col-span-1 sm:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
              Live Currency Conversion
            </span>
            <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">
              ExchangeRate API
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="text-lg font-bold text-white">
              {currency} {totalCost.toLocaleString()} =
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-emerald-400">
                {targetCurrency}{' '}
                {converting
                  ? '...'
                  : convertedTotal != null
                  ? convertedTotal.toLocaleString()
                  : (totalCost * 0.92).toFixed(2)}
              </span>
              <select
                value={targetCurrency}
                onChange={(e) => handleConvert(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none cursor-pointer"
              >
                {['EUR', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'INR', 'CHF'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Real-time conversion for international travel expense estimation.
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-400" />
          Budget Allocation by Category
        </h3>

        <div className="space-y-4">
          {[
            { key: 'tourism', label: 'Sightseeing & Attractions', icon: '🏛️' },
            { key: 'catering', label: 'Dining & Gastronomy', icon: '🍽️' },
            { key: 'entertainment', label: 'Entertainment & Nightlife', icon: '🎭' },
            { key: 'leisure', label: 'Parks & Nature Walks', icon: '🌲' }
          ].map(({ key, label, icon }) => {
            const amount = categoryTotals[key] || 0;
            const percentage = totalCost > 0 ? Math.round((amount / totalCost) * 100) : 0;

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span>{icon}</span> {label}
                  </span>
                  <span className="font-bold text-white">
                    {currency} {amount} <span className="text-slate-400 font-normal">({percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getCatColor(key)} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
