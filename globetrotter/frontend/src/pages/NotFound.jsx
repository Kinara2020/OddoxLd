import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2">404 - Off the Map</h1>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        The destination you are looking for does not exist or has moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back Home
      </Link>
    </div>
  );
}
