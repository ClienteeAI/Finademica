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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1f2e]/95 backdrop-blur-xl border-t border-[#2a3142] safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {mainNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] min-h-[48px] rounded-xl transition-all duration-200',
              isActive(item.path)
                ? 'text-[#38bdf8] bg-[#38bdf8]/10'
                : 'text-[#94a3b8] hover:text-[#cbd5e1] active:bg-[#2a3142]'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}

        {/* More Button with Sheet */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] min-h-[48px] rounded-xl transition-all duration-200',
                isMoreActive
                  ? 'text-[#38bdf8] bg-[#38bdf8]/10'
                  : 'text-[#94a3b8] hover:text-[#cbd5e1] active:bg-[#2a3142]'
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="bg-[#1a1f2e] border-t border-[#2a3142] rounded-t-3xl max-h-[70vh]"
          >
            <SheetHeader className="pb-4">
              <SheetTitle className="text-[#e2e8f0] text-lg">More Options</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 pb-8">
              {moreItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center justify-center px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 min-h-[52px]',
                    isActive(item.path)
                      ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30'
                      : 'bg-[#2a3142] text-[#cbd5e1] hover:bg-[#3a4152] active:scale-95'
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
