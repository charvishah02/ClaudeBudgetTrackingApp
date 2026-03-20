import { useExpenseState } from './hooks/useExpenseState';
import TabBar from './components/TabBar';
import DayView from './components/DayView';
import SummaryView from './components/SummaryView/SummaryView';
import { TAB_LABELS } from './constants';

export default function App() {
  const { state, setActiveTab, addEntry, deleteEntry } = useExpenseState();
  const { activeTab, days } = state;

  const isSummary = activeTab === TAB_LABELS.length - 1;
  const dayIndex = isSummary ? null : activeTab;

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-pink-500 pt-6 pb-0 shadow-lg">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-4">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Business Trip Expenses
            </h1>
            <p className="text-pink-100 text-sm mt-0.5">
              4-day trip &mdash; $100/day food budget
            </p>
          </div>
        </div>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {isSummary ? (
          <SummaryView days={days} />
        ) : (
          <div>
            <h2 className="text-lg font-bold text-pink-600 mb-4">
              {TAB_LABELS[dayIndex]}
            </h2>
            <DayView
              key={dayIndex}
              dayIndex={dayIndex}
              day={days[dayIndex]}
              onAddEntry={addEntry}
              onDeleteEntry={deleteEntry}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-pink-300">
          Data saved automatically to your browser &mdash; entries persist across refreshes.
        </p>
      </footer>
    </div>
  );
}
