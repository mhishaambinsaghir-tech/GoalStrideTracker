import { useEffect, useState } from 'react';
import { Calendar as CalIcon } from 'lucide-react';
import CalendarHeatmap from '../components/CalendarHeatmap';
import { getHeatmap, getGoals } from '../services/api';

export default function Calendar() {
  const [data, setData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getHeatmap(), getGoals()])
      .then(([h, g]) => { setData(h); setGoals(g); })
      .finally(() => setLoading(false));
  }, []);

  const totalDays = new Set(data.map(d => d.date)).size;
  const totalMinutes = data.reduce((s, d) => s + d.minutes, 0);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Calendar</h1>
        <p className="text-slate-400 mt-1">Your learning activity heatmap</p>
      </div>

      {/* Summary chips */}
      <div className="flex gap-4 flex-wrap">
        <div className="card py-3 px-5 flex items-center gap-3">
          <CalIcon size={18} className="text-primary-400" />
          <div>
            <p className="text-xs text-slate-500">Active Days</p>
            <p className="font-bold text-slate-100">{totalDays}</p>
          </div>
        </div>
        <div className="card py-3 px-5 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary-500" />
          <div>
            <p className="text-xs text-slate-500">Total Time</p>
            <p className="font-bold text-slate-100">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</p>
          </div>
        </div>
        <div className="card py-3 px-5 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success-500" />
          <div>
            <p className="text-xs text-slate-500">Goals Tracked</p>
            <p className="font-bold text-slate-100">{goals.length}</p>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card">
        <h2 className="section-title mb-6">52-Week Activity</h2>
        {data.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">
            No activity recorded yet. Start logging progress to see your heatmap!
          </p>
        ) : (
          <CalendarHeatmap data={data} />
        )}
      </div>

      {/* Per-goal breakdown */}
      <div className="card">
        <h2 className="section-title mb-4">Goal Breakdown</h2>
        <div className="space-y-3">
          {goals.map(g => (
            <div key={g.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-300 truncate">{g.title}</span>
                  <span className="text-xs font-semibold text-primary-400 ml-2">{g.completion_percent}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${g.completion_percent}%` }} />
                </div>
              </div>
              <span className="text-xs text-slate-500 w-16 text-right flex-shrink-0">{g.entry_count} entries</span>
            </div>
          ))}
        </div>
      </div>
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
