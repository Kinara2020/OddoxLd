import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Globe, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { tripsAPI } from '../api/client';

export default function ShareTripModal({ trip, onClose, onShared }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState(trip?.public_slug || '');
  const [error, setError] = useState('');

  const publicUrl = slug
    ? `${window.location.origin}/public/${slug}`
    : '';

  const handleEnableSharing = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await tripsAPI.share(trip.id);
      setSlug(res.data.public_slug);
      onShared(res.data);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-glow">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Share Itinerary</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Generate a public read-only link. Anyone with this link can view your route and clone it to their account.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {slug ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-indigo-300 truncate select-all">{publicUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={`/public/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview Public Page
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
              🔒 This trip is currently private. Enable sharing to create a unique slug.
            </div>

            <button
              type="button"
              onClick={handleEnableSharing}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-glow transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Public URL...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Publish & Generate Share Link
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
