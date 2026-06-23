import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Clock, Target } from 'lucide-react';
import ProgressEntryComponent from '../components/ProgressEntry';
import ProgressForm from '../components/ProgressForm';
import GoalForm from '../components/GoalForm';
import { getGoal, updateGoal, deleteGoal, createProgress, updateProgress, deleteProgress } from '../services/api';
import { statusClass, minutesToHours } from '../utils/helpers';

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const load = () =>
    getGoal(id)
      .then(setGoal)
      .catch(() => navigate('/goals'))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  async function handleDeleteGoal() {
    if (!window.confirm('Delete this goal and all its progress entries?')) return;
    await deleteGoal(id);
    navigate('/goals');
  }

  async function handleSaveGoal(data) {
    await updateGoal(id, data);
    await load();
  }

  async function handleSaveEntry(data) {
    if (data.id) { await updateProgress(data.id, data); }
    else         { await createProgress(data); }
    await load();
  }

  async function handleDeleteEntry(entryId) {
    if (!window.confirm('Delete this entry?')) return;
    await deleteProgress(entryId);
    setGoal(g => ({ ...g, progress_entries: g.progress_entries.filter(e => e.id !== entryId) }));
  }

  if (loading) return <Spinner />;
  if (!goal) return null;

  const totalMinutes = (goal.progress_entries || []).reduce((s, e) => s + (e.duration_minutes || 0), 0);
  const entries = [...(goal.progress_entries || [])].sort(
    (a, b) => new Date(b.entry_date) - new Date(a.entry_date)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back */}
      <button className="btn-ghost" onClick={() => navigate('/goals')}>
        <ArrowLeft size={16} /> Back to Goals
      </button>

      {/* Goal header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{goal.title}</h1>
              <span className={statusClass(goal.status)}>{goal.status}</span>
            </div>
            {goal.description && (
              <p className="text-slate-400 text-sm leading-relaxed">{goal.description}</p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="btn-ghost" onClick={() => setShowGoalForm(true)}>
              <Edit size={15} /> Edit
            </button>
            <button className="btn-danger" onClick={handleDeleteGoal}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 sm:gap-6 border-t border-dark-border pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Target size={16} className="text-primary-400" />
            <span className="text-slate-400">Progress:</span>
            <span className="font-semibold text-primary-400">{goal.completion_percent}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-accent-400" />
            <span className="text-slate-400">Total time:</span>
            <span className="font-semibold text-accent-400">{minutesToHours(totalMinutes)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Entries:</span>
            <span className="font-semibold text-slate-100">{entries.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${goal.completion_percent}%` }} />
          </div>
        </div>
      </div>

      {/* Progress timeline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="section-title">Progress Timeline</h2>
        <button className="btn-primary justify-center sm:justify-start" onClick={() => { setEditingEntry(null); setShowProgressForm(true); }}>
          <Plus size={16} /> Log Today
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="card text-center py-12 border-dashed">
          <p className="text-slate-500 mb-4">No progress logged yet.</p>
          <button className="btn-primary" onClick={() => setShowProgressForm(true)}>
            <Plus size={16} /> Log First Entry
          </button>
        </div>
      ) : (
        <div>
          {entries.map(entry => (
            <ProgressEntryComponent
              key={entry.id}
              entry={entry}
              onEdit={e => { setEditingEntry(e); setShowProgressForm(true); }}
              onDelete={handleDeleteEntry}
            />
          ))}
        </div>
      )}

      {showProgressForm && (
        <ProgressForm
          goalId={Number(id)}
          initial={editingEntry}
          onSave={handleSaveEntry}
          onClose={() => { setShowProgressForm(false); setEditingEntry(null); }}
        />
      )}

      {showGoalForm && (
        <GoalForm
          initial={goal}
          onSave={handleSaveGoal}
          onClose={() => setShowGoalForm(false)}
        />
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
