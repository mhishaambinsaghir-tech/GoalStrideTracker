export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary-500/20 to-primary-600/5 border-primary-500/20 text-primary-400',
    accent:  'from-accent-500/20  to-accent-600/5  border-accent-500/20  text-accent-400',
    success: 'from-success-500/20 to-success-600/5 border-success-500/20 text-success-400',
    warning: 'from-warning-500/20 to-warning-600/5 border-warning-500/20 text-warning-400',
  };
  const cls = colorMap[color] || colorMap.primary;

  return (
    <div className={`card bg-gradient-to-br ${cls} animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center ${cls}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
