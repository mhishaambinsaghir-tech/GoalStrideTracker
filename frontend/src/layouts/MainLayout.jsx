import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

export default function MainLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed left-0 top-0 z-50' : ''}
          ${isMobile && !mobileMenuOpen ? '-translate-x-full' : ''}
          transition-transform duration-300
        `}
      >
        <Sidebar onCloseMobile={() => isMobile && setMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-dark-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Mobile header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="font-bold text-slate-100">GoalStride</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="btn-ghost"
              >
                <Menu size={20} />
              </button>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
