import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const types = ['Prayer', 'Work', 'Fitness', 'Fun'];

export default function RoutineSetup() {
  const { state, dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [type, setType] = useState(types[0]);
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('09:00');

  const canAdd = useMemo(() => title.trim() && type && start && end, [title, type, start, end]);

  function addActivity(e) {
    e.preventDefault();
    if (!canAdd) return;
    const activity = {
      id: `a_${Date.now()}`,
      title: title.trim(),
      type,
      start,
      end,
      completedDates: [],
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
    setTitle('');
  }

  return (
    <div className="container-narrow py-4 space-y-6">
      <h2 className="text-xl font-semibold">Routine Setup</h2>

      <form onSubmit={addActivity} className="card grid gap-3">
        <div>
          <label className="label">Title</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Afternoon Walk" />
        </div>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <label className="label">Type</label>
            <select className="select" value={type} onChange={e => setType(e.target.value)}>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start</label>
              <input type="time" className="input" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div>
              <label className="label">End</label>
              <input type="time" className="input" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn-primary" disabled={!canAdd} type="submit">Add Activity</button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="font-medium">Existing Activities</h3>
        {state.activities.length === 0 && (
          <div className="card">No activities yet.</div>
        )}
        {state.activities.map(a => (
          <div key={a.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs opacity-70">{a.type} • {a.start}-{a.end}</div>
            </div>
            <button className="btn-secondary" onClick={() => dispatch({ type: 'DELETE_ACTIVITY', payload: a.id })}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}


