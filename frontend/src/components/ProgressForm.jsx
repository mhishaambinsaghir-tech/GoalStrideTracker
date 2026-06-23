import { useState } from 'react';
import { X } from 'lucide-react';
import { today } from '../utils/helpers';

export default function ProgressForm({ goalId, initial, onSave, onClose }) {
  const [form, setForm] = useState({
    goal_id: goalId,
    entry_date: today(),
    notes: '',
    duration_minutes: 30,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, duration_minutes: Number(form.duration_minutes) });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">{initial?.id ? 'Edit Entry' : 'Log Progress'}</h2>
          <button className="btn-ghost px-2 py-1" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              value={form.entry_date}
              onChange={e => setForm(f => ({ ...f, entry_date: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">What did you work on?</label>
            <textarea
              className="input resize-none"
              rows={4}
              placeholder="Day 1&#10;Installed Unity&#10;Created first project&#10;Learned C# basics"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Duration (minutes)</label>
            <input
              type="number"
              className="input"
              min={0}
              value={form.duration_minutes}
              onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving…' : 'Save Entry'}
            </button>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
