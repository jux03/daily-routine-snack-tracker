import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'drst_app_state_v1';

const defaultActivities = [
  { id: 'a1', title: 'Morning Prayer', type: 'Prayer', start: '06:30', end: '06:45', completedDates: [] },
  { id: 'a2', title: 'Work Session', type: 'Work', start: '09:00', end: '12:00', completedDates: [] },
  { id: 'a3', title: 'Gym', type: 'Fitness', start: '18:00', end: '19:00', completedDates: [] },
  { id: 'a4', title: 'Read & Relax', type: 'Fun', start: '21:00', end: '21:30', completedDates: [] },
];

const defaultSnacks = [
  { id: 's1', name: 'Greek Yogurt & Berries', category: 'Sports day', calories: 180, ingredients: 'Yogurt, strawberries, blueberries', eatenDates: [] },
  { id: 's2', name: 'Trail Mix', category: 'Work-heavy day', calories: 220, ingredients: 'Nuts, raisins, seeds, dark chocolate', eatenDates: [] },
  { id: 's3', name: 'Turkey Wrap', category: 'Guiding day', calories: 300, ingredients: 'Turkey, whole-wheat tortilla, veggies', eatenDates: [] },
];

const initialState = {
  activities: defaultActivities,
  snacks: defaultSnacks,
  completedDays: 0,
  settings: {
    darkMode: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  },
  seeded: false,
};

const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'SEED': {
      return { ...state, seeded: true };
    }
    case 'ADD_ACTIVITY': {
      return { ...state, activities: [...state.activities, action.payload] };
    }
    case 'DELETE_ACTIVITY': {
      return { ...state, activities: state.activities.filter(a => a.id !== action.payload) };
    }
    case 'TOGGLE_ACTIVITY_COMPLETE': {
      const { id, dateKey } = action.payload;
      const activities = state.activities.map(a => {
        if (a.id !== id) return a;
        const has = a.completedDates.includes(dateKey);
        return {
          ...a,
          completedDates: has ? a.completedDates.filter(d => d !== dateKey) : [...a.completedDates, dateKey],
        };
      });
      return { ...state, activities };
    }
    case 'MARK_DAY_COMPLETE': {
      return { ...state, completedDays: state.completedDays + 1 };
    }
    case 'ADD_SNACK': {
      return { ...state, snacks: [...state.snacks, action.payload] };
    }
    case 'TOGGLE_SNACK_EATEN': {
      const { id, dateKey } = action.payload;
      const snacks = state.snacks.map(s => {
        if (s.id !== id) return s;
        const has = s.eatenDates.includes(dateKey);
        return {
          ...s,
          eatenDates: has ? s.eatenDates.filter(d => d !== dateKey) : [...s.eatenDates, dateKey],
        };
      });
      return { ...state, snacks };
    }
    case 'SET_DARK_MODE': {
      return { ...state, settings: { ...state.settings, darkMode: action.payload } };
    }
    case 'SET_TIME_ZONE': {
      return { ...state, settings: { ...state.settings, timeZone: action.payload } };
    }
    case 'LOAD_STATE': {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      dispatch({ type: 'LOAD_STATE', payload: stored });
    } else {
      // Seed
      dispatch({ type: 'SEED' });
    }
  }, []);

  // Persist on change
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Sync dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [state.settings.darkMode]);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const value = useMemo(() => ({
    state,
    dispatch,
    todayKey,
  }), [state, todayKey]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}


