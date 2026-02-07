import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, Users, HelpCircle, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const mainNavItems = [
  { path: '/feed', label: 'Home', icon: Users },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/videos', label: 'Videos', icon: Video },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
];

const moreItems = [
  { path: '/arena', label: 'Arena' },
  { path: '/analyzer', label: 'Stock Analyzer' },
  { path: '/calculator', label: 'Calculator' },
  { path: '/diary', label: 'Trading Diary' },
  { path: '/roadmap', label: 'Roadmap' },
  { path: '/progress', label: 'Progress' },
  { path: '/profile', label: 'Profile' },
  { path: '/settings', label: 'Settings' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = moreItems.some(item => isActive(item.path));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1f2e]/98 backdrop-blur-xl border-t border-[#2a3142]/80 safe-area-bottom">
      <div className="flex items-stretch justify-around h-[60px]">
        {mainNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[56px] transition-all duration-200',
              isActive(item.path)
                ? 'text-[#38bdf8]'
                : 'text-[#64748b] active:text-[#94a3b8]'
            )}
          >
            <div className={cn(
              'flex items-center justify-center w-10 h-7 rounded-full transition-colors',
              isActive(item.path) ? 'bg-[#38bdf8]/15' : ''
            )}>
              <item.icon className="h-[22px] w-[22px]" />
            </div>
            <span className="text-[11px] font-medium">{item.label}</span>
          </Link>
        ))}

        {/* More Button with Sheet */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[56px] transition-all duration-200',
                isMoreActive
                  ? 'text-[#38bdf8]'
                  : 'text-[#64748b] active:text-[#94a3b8]'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-10 h-7 rounded-full transition-colors',
                isMoreActive ? 'bg-[#38bdf8]/15' : ''
              )}>
                <MoreHorizontal className="h-[22px] w-[22px]" />
              </div>
              <span className="text-[11px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="bg-[#1a1f2e] border-t border-[#2a3142] rounded-t-2xl max-h-[60vh] px-4 pb-8"
          >
            <SheetHeader className="pb-3 pt-1">
              <SheetTitle className="text-[#e2e8f0] text-base font-semibold">More Options</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center justify-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-150 min-h-[48px]',
                    isActive(item.path)
                      ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30'
                      : 'bg-[#252d3d] text-[#cbd5e1] active:bg-[#3a4152] active:scale-[0.98]'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
