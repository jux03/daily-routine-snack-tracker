import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import SnackItem from '../components/SnackItem.jsx';

export default function SnackLibrary() {
  const { state } = useApp();

  return (
    <div className="container-narrow py-4 space-y-4">
      <h2 className="text-xl font-semibold">Snack Library</h2>

      <div className="grid gap-3">
        {state.snacks.map(s => <SnackItem key={s.id} snack={s} />)}
      </div>
    </div>
  );
}


