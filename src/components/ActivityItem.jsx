import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const typeToColor = {
  Prayer: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700',
  Work: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200 dark:border-amber-700',
  Fitness: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700',
  Fun: 'bg-pink-100 text-pink-900 dark:bg-pink-900/40 dark:text-pink-200 border-pink-200 dark:border-pink-700',
};

export default function ActivityItem({ activity }) {
  const { dispatch, todayKey } = useApp();
  const isDone = activity.completedDates?.includes(todayKey);

  return (
    <div className={`card flex items-center gap-3 ${typeToColor[activity.type] || ''}`}>
      <input
        type="checkbox"
        checked={!!isDone}
        onChange={() => dispatch({ type: 'TOGGLE_ACTIVITY_COMPLETE', payload: { id: activity.id, dateKey: todayKey } })}
        className="h-5 w-5"
        aria-label={`Mark ${activity.title} as completed`}
      />
      <div className="flex-1">
        <div className="font-medium">{activity.title}</div>
        <div className="text-xs opacity-80">{activity.type} • {activity.start} - {activity.end}</div>
      </div>
    </div>
  );
}


