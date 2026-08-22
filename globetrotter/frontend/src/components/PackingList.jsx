import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Box, Package, HeartPulse, Laptop, Shirt, Bell, Trash2, Plus, Clock } from 'lucide-react';
import { tripsAPI } from '../api/client';

const CATEGORY_ICONS = {
  'Essentials': Box,
  'Clothing': Shirt,
  'Beach Gear': Package,
  'Tech & Gadgets': Laptop,
  'Health': HeartPulse
};

export default function PackingList({ tripId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [list, setList] = useState({});
  const [packedState, setPackedState] = useState({});

  // Custom Reminders State
  const [customItems, setCustomItems] = useState(() => {
    try {
      const stored = localStorage.getItem(`trip_reminders_${tripId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [newItemText, setNewItemText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');

  // Persist custom items
  useEffect(() => {
    localStorage.setItem(`trip_reminders_${tripId}`, JSON.stringify(customItems));
  }, [customItems, tripId]);

  // Check for reminder alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      let hasUpdates = false;
      const updated = customItems.map(item => {
        if (item.remindAt && item.remindAt <= now && !item.notified) {
          hasUpdates = true;
          alert(`Packing Reminder: Don't forget to pack "${item.item}"!`);
          return { ...item, notified: true };
        }
        return item;
      });
      if (hasUpdates) setCustomItems(updated);
    }, 10000); // check every 10s for quick testing
    return () => clearInterval(interval);
  }, [customItems]);

  const addCustomItem = () => {
    if (!newItemText.trim()) return;
    const newItem = {
      id: 'custom_' + Date.now(),
      item: newItemText.trim(),
      packed: false,
      remindAt: newReminderTime ? new Date(newReminderTime).toISOString() : null,
      notified: false
    };
    setCustomItems([...customItems, newItem]);
    setNewItemText('');
    setNewReminderTime('');
  };

  const toggleCustomItem = (id) => {
    setCustomItems(customItems.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const deleteCustomItem = (id) => {
    setCustomItems(customItems.filter(item => item.id !== id));
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await tripsAPI.getPackingList(tripId);
        setList(res.data || {});
      } catch (err) {
        setError('Failed to generate packing list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [tripId]);

  const toggleItem = (categoryId, itemId) => {
    setPackedState(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-4" />
        <p className="text-xs font-bold tracking-wider uppercase">AI is analyzing your itinerary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-rose-400 text-sm font-semibold bg-slate-900 rounded-2xl border border-rose-500/20">
        {error}
      </div>
    );
  }

  const categories = Object.keys(list);

  if (categories.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm font-semibold bg-slate-900 rounded-2xl border border-slate-800">
        No packing items generated for this trip yet.
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="mb-6 flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            Smart Packing List
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Custom-generated based on your destinations and planned activities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, idx) => {
          const items = list[category];
          const Icon = CATEGORY_ICONS[category] || Package;
          const packedCount = items.filter(item => packedState[item.id]).length;
          const progress = Math.round((packedCount / items.length) * 100) || 0;

          return (
            <div 
              key={category} 
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm">{category}</h3>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  {packedCount} / {items.length}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="h-1 w-full bg-slate-800">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="p-2">
                {items.map(item => {
                  const isPacked = !!packedState[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(category, item.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition group text-left"
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isPacked 
                          ? 'bg-indigo-500 border-indigo-500 text-white' 
                          : 'border-slate-600 group-hover:border-indigo-400'
                      }`}>
                        {isPacked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        isPacked ? 'text-slate-500 line-through' : 'text-slate-200'
                      }`}>
                        {item.item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Reminders Section */}
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
        style={{ animationDelay: `${categories.length * 150}ms` }}
      >
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Personal Reminders</h3>
          </div>
          <div className="text-xs font-bold text-slate-400">
            {customItems.filter(i => i.packed).length} / {customItems.length}
          </div>
        </div>

        <div className="p-2">
          {customItems.length === 0 ? (
            <div className="text-center p-6 text-xs font-semibold text-slate-500">
              No custom reminders added yet.
            </div>
          ) : (
            customItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 group p-2 hover:bg-slate-800/50 rounded-xl transition">
                <button
                  onClick={() => toggleCustomItem(item.id)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    item.packed 
                      ? 'bg-indigo-500 border-indigo-500 text-white' 
                      : 'border-slate-600 group-hover:border-indigo-400'
                  }`}>
                    {item.packed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium transition-colors ${
                      item.packed ? 'text-slate-500 line-through' : 'text-slate-200'
                    }`}>
                      {item.item}
                    </span>
                    {item.remindAt && (
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${item.notified ? 'text-slate-500' : 'text-indigo-400'}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(item.remindAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {item.notified && " (Sent)"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => deleteCustomItem(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomItem()}
              placeholder="e.g. Passports, Gifts..."
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <input
              type="datetime-local"
              value={newReminderTime}
              onChange={e => setNewReminderTime(e.target.value)}
              title="Set a reminder time"
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={addCustomItem}
              disabled={!newItemText.trim()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
