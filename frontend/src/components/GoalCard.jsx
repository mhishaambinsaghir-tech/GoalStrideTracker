import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, ExternalLink } from 'lucide-react';
import { statusClass, formatDate } from '../utils/helpers';

export default function GoalCard({ goal, onEdit, onDelete }) {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="card cursor-pointer group animate-slide-up relative"
      onClick={() => navigate(`/goals/${goal.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate group-hover:text-primary-400 transition-colors">
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{goal.description}</p>
          )}
        </div>
        {/* Actions menu */}
        <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
          <button
            className="btn-ghost px-2 py-1 opacity-0 group-hover:opacity-100"
            onClick={() => setMenu(m => !m)}
          >
            <MoreVertical size={16} />
          </button>
          {menu && (
            <div className="absolute right-0 top-8 z-20 bg-dark-card border border-dark-border rounded-xl shadow-xl p-1 min-w-[140px] animate-fade-in">
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-dark-muted/40 rounded-lg transition"
                onClick={() => { onEdit(goal); setMenu(false); }}
              >
                <Edit size={14} /> Edit
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                onClick={() => { onDelete(goal.id); setMenu(false); }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status + date */}
      <div className="flex items-center gap-2 mb-4">
        <span className={statusClass(goal.status)}>{goal.status}</span>
        <span className="text-xs text-slate-600">·</span>
        <span className="text-xs text-slate-500">{goal.entry_count} entries</span>
        <span className="text-xs text-slate-600">·</span>
        <span className="text-xs text-slate-500">{formatDate(goal.created_at)}</span>
      </div>

      {/* Progress bar */}
      <div className="mb-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-semibold text-primary-400">{goal.completion_percent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${goal.completion_percent}%` }} />
        </div>
      </div>

      {/* View link */}
      <div className="flex justify-end mt-3">
        <span className="text-xs text-primary-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          View details <ExternalLink size={11} />
        </span>
      </div>
    </div>
  );
}
