import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { getGoals, getProgress } from '../services/api';
import { minutesToHours } from '../utils/helpers';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

export default function Analytics() {
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getGoals(), getProgress()])
      .then(([g, p]) => { setGoals(g); setProgress(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  // ── Chart data computations ────────────────────────────────────────────────

  // 1. Per-goal completion bar chart
  const completionData = goals.map(g => ({
    name: g.title.length > 20 ? g.title.slice(0, 18) + '…' : g.title,
    completion: g.completion_percent,
    entries: g.entry_count,
  }));

  // 2. Daily minutes logged for last 30 days (line chart)
  const last30 = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  const dateMinutes = {};
  progress.forEach(p => {
    dateMinutes[p.entry_date] = (dateMinutes[p.entry_date] || 0) + (p.duration_minutes || 0);
  });
  const activityData = last30.map(date => ({
    date: date.slice(5),  // MM-DD
    minutes: dateMinutes[date] || 0,
  }));

  // 3. Status distribution pie chart
  const statusCounts = goals.reduce((acc, g) => {
    acc[g.status] = (acc[g.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // 4. Time per goal (horizontal bar)
  const goalTimeData = goals.map(g => {
    const mins = progress
      .filter(p => p.goal_id === g.id)
      .reduce((s, p) => s + (p.duration_minutes || 0), 0);
    return {
      name: g.title.length > 18 ? g.title.slice(0, 16) + '…' : g.title,
      hours: parseFloat((mins / 60).toFixed(1)),
    };
  }).filter(x => x.hours > 0);

  const tooltipStyle = {
    backgroundColor: '#1e1e2e',
    border: '1px solid #2a2a3e',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: 12,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Analytics</h1>
        <p className="text-slate-400 mt-1">Deep-dive into your learning patterns</p>
      </div>

      {goals.length === 0 ? (
        <div className="card text-center py-16 border-dashed">
          <p className="text-slate-500">No data yet. Create goals and log progress to see analytics.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Goal Completion */}
            <div className="card">
              <h2 className="section-title mb-4">Goal Completion</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={completionData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v}%`, 'Completion']} />
                  <Bar dataKey="completion" fill="#6366f1" radius={[6, 6, 0, 0]}>
                    {completionData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status Pie */}
            <div className="card">
              <h2 className="section-title mb-4">Goal Status</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2 — Activity over time */}
          <div className="card">
            <h2 className="section-title mb-4">Daily Activity (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={4} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit="m" />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [minutesToHours(v), 'Time']} />
                <Line
                  type="monotone" dataKey="minutes"
                  stroke="#a855f7" strokeWidth={2}
                  dot={false} activeDot={{ r: 5, fill: '#a855f7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Row 3 — Time per goal */}
          {goalTimeData.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-4">Time Invested per Goal</h2>
              <ResponsiveContainer width="100%" height={Math.max(180, goalTimeData.length * 50)}>
                <BarChart data={goalTimeData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="h" />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v}h`, 'Hours']} />
                  <Bar dataKey="hours" fill="#10b981" radius={[0, 6, 6, 0]}>
                    {goalTimeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
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
