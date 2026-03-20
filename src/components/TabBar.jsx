import { TAB_LABELS } from '../constants';

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="bg-pink-500 px-4 pt-4 pb-0 shadow-md">
      <div className="max-w-3xl mx-auto flex gap-1">
        {TAB_LABELS.map((label, index) => (
          <button
            key={label}
            onClick={() => onTabChange(index)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors focus:outline-none ${
              activeTab === index
                ? 'bg-white text-pink-600 font-bold shadow-sm'
                : 'text-white hover:bg-pink-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
