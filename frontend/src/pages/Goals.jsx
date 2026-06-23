import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';

const FILTERS = ['all', 'active', 'paused', 'completed'];

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => getGoals().then(setGoals).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const filtered = goals.filter(g => {
    const matchFilter = filter === 'all' || g.status === filter;
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  async function handleSave(data) {
    if (data.id) { await updateGoal(data.id, data); }
    else          { await createGoal(data); }
    await load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this goal and all its progress? This cannot be undone.')) return;
    await deleteGoal(id);
    setGoals(g => g.filter(x => x.id !== id));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Goals</h1>
          <p className="text-slate-400 mt-1">{goals.length} goals total</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-9"
            placeholder="Search goals…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} capitalize`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 border-dashed">
          <p className="text-slate-500 mb-4">
            {search ? 'No goals match your search.' : 'No goals yet. Create your first one!'}
          </p>
          {!search && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Create Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={g => { setEditing(g); setShowForm(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <GoalForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
