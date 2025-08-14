import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function Progress() {
  const { state } = useApp();

  const snackStats = useMemo(() => {
    const totalEaten = state.snacks.reduce((acc, s) => acc + (s.eatenDates?.length || 0), 0);
    const totalCalories = state.snacks.reduce((acc, s) => acc + (s.calories * (s.eatenDates?.length || 0)), 0);
    return { totalEaten, totalCalories };
  }, [state.snacks]);

  return (
    <div className="container-narrow py-4 space-y-4">
      <h2 className="text-xl font-semibold">Progress</h2>
      <div className="grid gap-3">
        <div className="card">
          <div className="text-sm opacity-70">Days Completed</div>
          <div className="text-3xl font-bold">{state.completedDays}</div>
        </div>
        <div className="card">
          <div className="text-sm opacity-70">Snack Consumption</div>
          <div className="text-lg">Total snacks eaten: <span className="font-semibold">{snackStats.totalEaten}</span></div>
          <div className="text-lg">Total calories: <span className="font-semibold">{snackStats.totalCalories}</span></div>
        </div>
      </div>
    </div>
  );
}


