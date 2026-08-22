import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Wallet, TrendingUp, DollarSign, Activity, AlertCircle, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#14b8a6', '#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899', '#64748b'];

export default function BudgetBreakdown() {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(1);
  const [rateLoading, setRateLoading] = useState(false);
  
  const baseTripBudget = budget?.total_budget || 5000;

  const loadBudget = async () => {
    try {
      const res = await api.get(`/budget/${id}`);
      setBudget(res.data);
    } catch (err) {
      console.warn("Backend not connected. Loading mock budget data.");
      setBudget({
        total_activity_cost: 3250,
        by_category: {
          'Flights & Transport': 1200,
          'Accommodation': 1100,
          'Food & Dining': 500,
          'Activities & Tours': 350,
          'Miscellaneous': 100
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBudget(); }, [id]);

  useEffect(() => {
    if (budget?.primary_country) {
      if (budget.primary_country.toLowerCase().includes('india')) {
        setCurrency('INR');
      } else {
        setCurrency('USD');
      }
    }
  }, [budget?.primary_country]);

  useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'USD') {
        setRate(1);
        return;
      }
      setRateLoading(true);
      try {
        const res = await api.get(`/rates?from=USD&to=${currency}`);
        setRate(res.data.multiplier);
      } catch (err) {
        console.error("Failed to fetch exchange rate", err);
      } finally {
        setRateLoading(false);
      }
    };
    fetchRate();
  }, [currency]);

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const chartData = Object.entries(budget?.by_category || {}).map(([name, value]) => ({ name, value: value * rate }));
  const totalCost = (budget?.total_activity_cost || 0) * rate;
  const tripBudget = baseTripBudget * rate;
  const budgetPercentage = Math.min((totalCost / tripBudget) * 100, 100);
  const isOverBudget = totalCost > tripBudget;
  
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹' };
  const sym = currencySymbols[currency] || '$';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-card">
          <p className="text-white font-bold text-sm mb-1">{payload[0].name}</p>
          <p className="text-primary font-bold">
            {sym}{payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-enter">
      
      {/* ── Top Navigation ── */}
      <Link
        to={`/trips/${id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-white transition-colors mb-8 group"
      >
        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-surface-hover border border-border">
          <ArrowLeft size={16} />
        </div>
        Back to Workspace
      </Link>

      {/* ── Header ── */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
            <Wallet className="text-primary w-10 h-10" />
            Budget Tracker
          </h1>
          <p className="text-lg text-muted">Monitor your estimated travel expenses across all destinations.</p>
        </div>
        
        {/* Currency Selector */}
        <div className="relative group">
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Currency</label>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="appearance-none bg-surface border border-border text-white text-sm font-bold rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-primary cursor-pointer w-32"
            >
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="GBP">🇬🇧 GBP</option>
              <option value="JPY">🇯🇵 JPY</option>
              <option value="INR">🇮🇳 INR</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
              {rateLoading ? <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : '▼'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Total Estimated Cost */}
        <div className="gt-card p-6 bg-surface/50 border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider">Total Expenses</h3>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-4xl font-black text-white">{sym}{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>

        {/* Target Budget */}
        <div className="gt-card p-6 bg-surface/50 border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider">Target Budget</h3>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-4xl font-black text-white">{sym}{tripBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>

        {/* Remaining / Over Budget */}
        <div className={`gt-card p-6 border ${isOverBudget ? 'bg-rose-500/10 border-rose-500/30' : 'bg-surface/50 border-border'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isOverBudget ? 'text-rose-400' : 'text-muted'}`}>
              {isOverBudget ? 'Over Budget' : 'Remaining Funds'}
            </h3>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOverBudget ? 'bg-rose-500/20 text-rose-400' : 'bg-green-500/10 text-green-400'}`}>
              {isOverBudget ? <AlertCircle size={16} /> : <Activity size={16} />}
            </div>
          </div>
          <p className={`text-4xl font-black ${isOverBudget ? 'text-rose-400' : 'text-white'}`}>
            {sym}{Math.abs(tripBudget - totalCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="mb-12 gt-card p-8 bg-surface/50 border-border">
        <div className="flex justify-between text-sm font-bold mb-3">
          <span className="text-white">Budget Utilization</span>
          <span className={isOverBudget ? 'text-rose-400' : 'text-primary'}>{budgetPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-4 w-full bg-background rounded-full overflow-hidden border border-border">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isOverBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-primary to-accent'}`}
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>
        {isOverBudget && (
          <p className="text-xs text-rose-400 mt-3 font-semibold flex items-center gap-1">
            <AlertCircle size={12} /> You have exceeded your target budget limit.
          </p>
        )}
      </div>

      {/* ── Visual Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Interactive Chart */}
        <div className="gt-card p-8 bg-surface/50 border-border flex flex-col items-center justify-center relative min-h-[400px]">
          <h2 className="absolute top-8 left-8 text-lg font-bold text-white flex items-center gap-2">
            <PieChartIcon className="text-accent" size={20} />
            Category Split
          </h2>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} className="mt-10">
              <PieChart>
                <Pie 
                  data={chartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70}
                  outerRadius={100} 
                  paddingAngle={5}
                  stroke="none"
                >
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted flex flex-col items-center gap-3">
              <PieChartIcon className="w-12 h-12 opacity-20" />
              <p>Add activities to your itinerary to see a breakdown.</p>
            </div>
          )}
        </div>

        {/* Right: Detailed List */}
        <div className="gt-card p-8 bg-surface/50 border-border">
          <h2 className="text-lg font-bold text-white mb-6">Expense Details</h2>
          
          {chartData.length > 0 ? (
            <div className="space-y-4">
              {chartData.sort((a, b) => b.value - a.value).map((item, idx) => {
                const percentage = ((item.value / totalCost) * 100).toFixed(1);
                return (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <div>
                        <p className="font-bold text-white text-sm">{item.name}</p>
                        <p className="text-xs text-muted">{percentage}% of total</p>
                      </div>
                    </div>
                    <span className="font-black text-white text-lg">
                      {sym}{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted py-10 border border-dashed border-border rounded-xl">
              <p className="text-sm">No expenses tracked yet.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}