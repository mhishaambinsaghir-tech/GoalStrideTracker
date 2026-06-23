import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUSES = ['active', 'paused', 'completed'];

export default function GoalForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'active',
    target_days: 10,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) setForm({ title: '', description: '', status: 'active', target_days: 10, ...initial });
  }, [initial]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.target_days || form.target_days < 1) { setError('Target days must be a positive integer.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
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
          <h2 className="section-title">{initial?.id ? 'Edit Goal' : 'New Goal'}</h2>
          <button className="btn-ghost px-2 py-1" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              className="input"
              placeholder="e.g. Learn Unity Game Development"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="What do you want to achieve?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Target Days</label>
              <input
                type="number" min={1} step={1}
                className="input mt-1"
                placeholder="e.g. 10"
                value={form.target_days}
                onChange={e => setForm(f => ({ ...f, target_days: e.target.value ? parseInt(e.target.value, 10) : '' }))}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving…' : 'Save Goal'}
            </button>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
