import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabaseClient';
import { ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Your Profile</h1>
        <p className="text-sm text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="gt-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <User size={28} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.email}</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md">
              Active Member
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input 
            value={user?.email || ''} 
            disabled 
            className="w-full opacity-60 cursor-not-allowed" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            className="w-full" 
            placeholder="Explorer Demo" 
          />
        </div>

        <div className="pt-4 border-t border-[#222c3c]">
          <button type="submit" className="w-full btn-primary py-3.5 text-sm">
            {saved ? 'Changes Saved ✓' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}