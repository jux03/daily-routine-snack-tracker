import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const timeZones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export default function Settings() {
  const { state, dispatch } = useApp();
  async function requestNotifications() {
    try {
      if (!('Notification' in window)) return alert('Notifications not supported');
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
      // Try showing a test notification via SW if available
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('Daily Routine', { body: 'Notifications enabled! 🎉' });
      } else {
        new Notification('Daily Routine', { body: 'Notifications enabled! 🎉' });
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="container-narrow py-4 space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>

      <div className="card flex items-center justify-between">
        <div>
          <div className="font-medium">Dark Mode</div>
          <div className="text-sm opacity-70">Toggle dark theme</div>
        </div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.settings.darkMode}
            onChange={e => dispatch({ type: 'SET_DARK_MODE', payload: e.target.checked })}
          />
          <span>{state.settings.darkMode ? 'On' : 'Off'}</span>
        </label>
      </div>

      <div className="card grid gap-2">
        <div className="font-medium">Time Zone</div>
        <select
          className="select"
          value={state.settings.timeZone}
          onChange={e => dispatch({ type: 'SET_TIME_ZONE', payload: e.target.value })}
        >
          {[state.settings.timeZone, ...timeZones.filter(t => t !== state.settings.timeZone)].map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div className="card flex items-center justify-between">
        <div>
          <div className="font-medium">Notifications</div>
          <div className="text-sm opacity-70">Request browser notification permission</div>
        </div>
        <button className="btn-primary" onClick={requestNotifications}>Enable</button>
      </div>
    </div>
  );
}


