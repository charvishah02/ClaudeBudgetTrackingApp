import { useState, useEffect } from 'react';
import { NUM_DAYS, STORAGE_KEY } from '../constants';

function buildEmptyState() {
  return {
    activeTab: 0,
    days: Array.from({ length: NUM_DAYS }, () => ({ food: [], transport: [] })),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return buildEmptyState();
}

export function useExpenseState() {
  const [state, setState] = useState(loadState);

  // Persist every state change to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function setActiveTab(tabIndex) {
    setState((prev) => ({ ...prev, activeTab: tabIndex }));
  }

  /**
   * type: 'food' | 'transport'
   * entry: { description, amount, category }
   */
  function addEntry(dayIndex, type, entry) {
    const newEntry = {
      id: crypto.randomUUID(),
      description: entry.description.trim(),
      amount: parseFloat(entry.amount),
      category: entry.category,
    };
    setState((prev) => {
      const days = prev.days.map((day, i) => {
        if (i !== dayIndex) return day;
        return { ...day, [type]: [...day[type], newEntry] };
      });
      return { ...prev, days };
    });
  }

  function deleteEntry(dayIndex, type, id) {
    setState((prev) => {
      const days = prev.days.map((day, i) => {
        if (i !== dayIndex) return day;
        return { ...day, [type]: day[type].filter((e) => e.id !== id) };
      });
      return { ...prev, days };
    });
  }

  return { state, setActiveTab, addEntry, deleteEntry };
}
