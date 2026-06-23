import { useMemo } from 'react';

/**
 * GitHub-style contribution heatmap.
 * Props:
 *  data: [{ date: "YYYY-MM-DD", minutes: number }]
 */
export default function CalendarHeatmap({ data }) {
  const { weeks, months } = useMemo(() => buildGrid(data), [data]);

  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-8">
        {months.map(({ label, offset }, i) => (
          <div key={i} className="text-[10px] text-slate-500" style={{ width: `${offset * 14}px`, minWidth: 0 }}>
            {label}
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
            <div key={i} className="text-[9px] text-slate-600 h-[11px] leading-[11px]">{d}</div>
          ))}
        </div>

        {/* Columns = weeks */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) =>
                day ? (
                  <div
                    key={di}
                    title={`${day.date}: ${day.minutes}min`}
                    className={`w-[11px] h-[11px] rounded-sm transition-all duration-150 cursor-pointer
                      ${intensityClass(day.minutes)}`}
                  />
                ) : (
                  <div key={di} className="w-[11px] h-[11px]" />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 ml-8">
        <span className="text-[10px] text-slate-500">Less</span>
        {[0, 15, 30, 60, 90].map(m => (
          <div key={m} className={`w-[11px] h-[11px] rounded-sm ${intensityClass(m)}`} />
        ))}
        <span className="text-[10px] text-slate-500">More</span>
      </div>
    </div>
  );
}

function intensityClass(minutes) {
  if (!minutes)    return 'bg-dark-muted/40';
  if (minutes < 20) return 'bg-primary-900/80';
  if (minutes < 45) return 'bg-primary-700/80';
  if (minutes < 75) return 'bg-primary-600';
  return 'bg-primary-400';
}

function buildGrid(data) {
  const dateMap = {};
  data.forEach(({ date, minutes }) => { dateMap[date] = minutes; });

  const today = new Date();
  const end = new Date(today);
  // Go back 52 weeks from today
  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7);
  // Align to Sunday
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let week = [];
  const months = [];
  let lastMonth = -1;
  let weekOffset = 0;

  const cur = new Date(start);
  while (cur <= end) {
    const iso = cur.toISOString().slice(0, 10);
    const day = {
      date: iso,
      minutes: dateMap[iso] || 0,
    };
    week.push(day);

    // Month label tracking
    const m = cur.getMonth();
    if (m !== lastMonth) {
      months.push({ label: cur.toLocaleString('default', { month: 'short' }), offset: weekOffset });
      lastMonth = m;
      weekOffset = 0;
    }

    if (cur.getDay() === 6) {
      weeks.push(week);
      week = [];
      weekOffset++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  if (week.length) weeks.push(week);

  return { weeks, months };
}
