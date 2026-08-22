import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Plus } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Map, 
  title = 'No items found', 
  message = 'Get started by creating something new.',
  actionText = 'Create New',
  actionLink = '/trips/new'
}) {
  return (
    <div className="gt-card p-12 text-center flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border-dashed border-border hover:border-primary/50 transition-colors duration-300">
      <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-6 shadow-glow">
        <Icon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-muted max-w-md mx-auto mb-8">{message}</p>
      
      {actionLink && actionText && (
        <Link to={actionLink} className="btn-primary">
          <Plus size={18} /> {actionText}
        </Link>
      )}
    </div>
  );
}
