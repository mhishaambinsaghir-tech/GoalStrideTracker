import { Edit, Trash2, Clock } from 'lucide-react';
import { formatDate, minutesToHours } from '../utils/helpers';

export default function ProgressEntry({ entry, onEdit, onDelete }) {
  return (
    <div className="flex gap-4 group animate-slide-up">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="timeline-dot" />
        <div className="w-px flex-1 bg-dark-border min-h-[2rem]" />
      </div>

      {/* Content */}
      <div className="card flex-1 mb-4 group-hover:border-primary-500/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-sm font-semibold text-slate-200">{formatDate(entry.entry_date)}</span>
            {entry.duration_minutes > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock size={11} /> {minutesToHours(entry.duration_minutes)}
              </span>
            )}
          </div>
          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button className="btn-ghost px-2 py-1" onClick={() => onEdit(entry)}>
              <Edit size={13} />
            </button>
            <button className="btn-danger px-2 py-1" onClick={() => onDelete(entry.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        {entry.notes ? (
          <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">{entry.notes}</p>
        ) : (
          <p className="text-xs text-slate-600 italic">No notes.</p>
        )}
      </div>
    </div>
  );
}
