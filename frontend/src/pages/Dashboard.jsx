import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Clock, Flame, CheckCircle, ArrowRight, Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import { toast } from 'react-hot-toast';
import { getStats, getGoals, getProgress } from '../services/api';
import { formatDate, minutesToHours, daysAgo } from '../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getGoals(), getProgress()])
      .then(([s, g, p]) => {
        setStats(s);
        setGoals(g);
        setRecent(p.slice(0, 8));

        // Check for deadlines (only once per session)
        if (!sessionStorage.getItem('deadlinesChecked')) {
          const today = new Date();
          g.filter(goal => goal.status === 'active').forEach(goal => {
            const deadline = new Date(goal.deadline_date);
            const diffTime = deadline - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 3 && diffDays > 0) {
              toast(`⚠️ Deadline approaching for "${goal.title}" in ${diffDays} days!`, { icon: '⏳' });
            } else if (diffDays <= 0) {
              toast.error(`Deadline passed for "${goal.title}"!`, { icon: '🚨' });
            }
          });
          sessionStorage.setItem('deadlinesChecked', 'true');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-slate-400 mt-1">Track your learning journey, one day at a time.</p>
        </div>
        <Link to="/goals" className="btn-primary">
          <Plus size={16} /> New Goal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Goals"    value={stats?.active_goals ?? 0}    icon={Target}      color="primary" />
        <StatCard title="Hours Logged"    value={`${stats?.total_hours ?? 0}h`} icon={Clock}     color="accent"  />
        <StatCard title="Day Streak"      value={stats?.current_streak ?? 0}   icon={Flame}      color="warning" subtitle="consecutive days" />
        <StatCard title="Completed"       value={stats?.completed_goals ?? 0}  icon={CheckCircle} color="success" />
      </div>

      {/* Active goals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Active Goals</h2>
          <Link to="/goals" className="btn-ghost text-xs">View all <ArrowRight size={13} /></Link>
        </div>
        {goals.filter(g => g.status === 'active').length === 0 ? (
          <EmptyState message="No active goals. Create one to get started!" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.filter(g => g.status === 'active').slice(0, 6).map(goal => (
              <Link key={goal.id} to={`/goals/${goal.id}`} className="card group block">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="font-semibold text-slate-100 group-hover:text-primary-400 transition-colors truncate">
                    {goal.title}
                  </h3>
                  <span className="badge-active flex-shrink-0">{goal.status}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${goal.completion_percent}%` }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-500">{goal.entry_count} entries</span>
                  <span className="text-xs font-semibold text-primary-400">{goal.completion_percent}%</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Activity</h2>
        </div>
        {recent.length === 0 ? (
          <EmptyState message="No progress yet. Log your first entry!" />
        ) : (
          <div className="card divide-y divide-dark-border p-0 overflow-hidden">
            {recent.map(entry => {
              const goal = goals.find(g => g.id === entry.goal_id);
              return (
                <Link
                  key={entry.id}
                  to={`/goals/${entry.goal_id}`}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-dark-muted/20 transition group"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-slate-300 group-hover:text-primary-400 transition truncate">
                        {goal?.title ?? 'Unknown Goal'}
                      </span>
                      <span className="text-xs text-slate-600 flex-shrink-0">{daysAgo(entry.entry_date)}</span>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-slate-500 truncate">{entry.notes}</p>
                    )}
                  </div>
                  {entry.duration_minutes > 0 && (
                    <span className="text-xs text-slate-500 flex-shrink-0 flex items-center gap-1">
                      <Clock size={11} /> {minutesToHours(entry.duration_minutes)}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="card text-center py-12 border-dashed border-dark-border">
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}
