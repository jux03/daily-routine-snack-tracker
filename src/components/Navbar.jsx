import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Navbar() {
  const { state, dispatch } = useApp();

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div className="container-narrow flex items-center gap-2 py-3">
        <div className="font-semibold">Daily Routine & Snack Tracker</div>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <button
            className="btn-secondary"
            onClick={() => dispatch({ type: 'SET_DARK_MODE', payload: !state.settings.darkMode })}
            aria-label="Toggle theme"
          >
            {state.settings.darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
      <div className="container-narrow grid grid-cols-6 gap-2 pb-3 overflow-x-auto">
        <Tab to="/">Dashboard</Tab>
        <Tab to="/routine">Routine</Tab>
        <Tab to="/snacks">Snacks</Tab>
        <Tab to="/scan">Scan</Tab>
        <Tab to="/progress">Progress</Tab>
        <Tab to="/settings">Settings</Tab>
      </div>
    </nav>
  );
}

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `text-center rounded-md px-3 py-2 text-sm ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}
      end
    >
      {children}
    </NavLink>
  );
}


