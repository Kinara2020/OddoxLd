import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Map, PlusCircle, User, Search } from 'lucide-react';

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: Compass, label: 'Discover', path: '/explore' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: PlusCircle, label: 'Create', path: '/trips/new', primary: true },
    { icon: Map, label: 'Trips', path: '/trips' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          if (item.primary) {
            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center w-14 -mt-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-glow-primary text-white">
                  <Icon size={24} />
                </div>
              </Link>
            );
          }

          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center justify-center w-14 gap-1 transition-colors duration-200 ${active ? 'text-primary' : 'text-muted hover:text-white'}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
