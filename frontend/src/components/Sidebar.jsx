import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Target, Calendar, BarChart2,
  Sun, Moon, ChevronLeft, ChevronRight, Zap, LogOut
} from 'lucide-react';

const links = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/goals',     icon: Target,          label: 'Goals'      },
  { to: '/calendar',  icon: Calendar,        label: 'Calendar'   },
  { to: '/analytics', icon: BarChart2,       label: 'Analytics'  },
];

export default function Sidebar({ onCloseMobile }) {
  const { dark, toggle } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    onCloseMobile?.();
  };

  const handleNavigate = () => {
    onCloseMobile?.();
  };

  return (
    <aside
      className={`
        flex flex-col h-screen bg-dark-surface border-r border-dark-border
        transition-all duration-300 flex-shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-sm text-slate-100 leading-tight">GoalStride</p>
            <p className="text-[10px] text-slate-500 leading-tight">Tracker</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="px-2 pb-4 space-y-1 border-t border-dark-border pt-4">
        <button
          onClick={toggle}
          className={`nav-item w-full ${collapsed ? 'justify-center' : ''}`}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>{dark ? 'Light mode' : 'Dark mode'}</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`nav-item w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => setCollapsed(c => !c)}
          className={`nav-item w-full ${collapsed ? 'justify-center' : ''} hidden md:flex`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
