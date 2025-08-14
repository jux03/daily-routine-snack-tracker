import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import ActivityItem from '../components/ActivityItem.jsx';

export default function Dashboard() {
  const { state, todayKey, dispatch } = useApp();

  const allDone = useMemo(() => {
    if (!state.activities.length) return false;
    return state.activities.every(a => a.completedDates?.includes(todayKey));
  }, [state.activities, todayKey]);

  return (
    <div className="container-narrow space-y-4 py-4">
      <div className="card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">Today</div>
            <div className="text-2xl font-semibold">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Completed</div>
            <div className="text-2xl font-bold">{state.activities.filter(a => a.completedDates?.includes(todayKey)).length}/{state.activities.length}</div>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded bg-white/20">
          <div className="h-2 rounded bg-white" style={{ width: `${Math.min(100, Math.round((state.activities.filter(a => a.completedDates?.includes(todayKey)).length / (state.activities.length || 1)) * 100))}%` }} />
        </div>
        <div className="mt-3 flex justify-end">
          <button
            className="btn bg-white text-blue-700 hover:bg-blue-50"
            onClick={() => dispatch({ type: 'MARK_DAY_COMPLETE' })}
            disabled={!allDone}
            title={allDone ? 'Mark day complete' : 'Complete all activities to enable'}
          >
            Mark Day Complete
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {state.activities.length === 0 && (
          <div className="card">No activities yet. Add some in Routine.</div>
        )}
        {state.activities.map(a => (
          <ActivityItem key={a.id} activity={a} />
        ))}
      </div>
    </div>
  );
}


