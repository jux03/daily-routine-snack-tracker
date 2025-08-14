import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function SnackItem({ snack }) {
  const { dispatch, todayKey } = useApp();
  const eaten = snack.eatenDates?.includes(todayKey);

  return (
    <div className="card flex items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{snack.name}</div>
          <div className="text-xs opacity-70">{snack.category}</div>
        </div>
        <div className="text-xs opacity-80">Calories: {snack.calories}</div>
        <div className="text-xs opacity-60">Ingredients: {snack.ingredients}</div>
      </div>
      <button
        className={`btn ${eaten ? 'bg-green-600 text-white hover:bg-green-700' : 'btn-secondary'}`}
        onClick={() => dispatch({ type: 'TOGGLE_SNACK_EATEN', payload: { id: snack.id, dateKey: todayKey } })}
      >
        {eaten ? 'Eaten' : 'Mark Eaten'}
      </button>
    </div>
  );
}


