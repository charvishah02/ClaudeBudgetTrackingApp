import { formatCurrency } from '../utils/formatters';

export default function EntryRow({ entry, onDelete }) {
  return (
    <div className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-pink-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="inline-block bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
          {entry.category}
        </span>
        <span className="text-sm text-gray-700 truncate">{entry.description}</span>
      </div>
      <div className="flex items-center gap-2 ml-3 shrink-0">
        <span className="text-sm font-semibold text-gray-800">{formatCurrency(entry.amount)}</span>
        <button
          onClick={() => onDelete(entry.id)}
          className="invisible group-hover:visible text-gray-300 hover:text-red-500 transition-colors text-lg leading-none font-bold focus:outline-none"
          aria-label="Delete entry"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
