import { TRANSPORT_COLORS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';

export default function TransportBreakdownCard({ days }) {
  // Group transport entries by category across all days
  const byCategory = {};
  days.forEach((day) => {
    day.transport.forEach((entry) => {
      if (!byCategory[entry.category]) {
        byCategory[entry.category] = 0;
      }
      byCategory[entry.category] += entry.amount;
    });
  });

  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const total = categories.reduce((acc, [, amt]) => acc + amt, 0);

  return (
    <div className="bg-white border border-pink-200 rounded-xl shadow-sm p-5">
      <h3 className="text-pink-600 font-semibold text-base mb-4">Transport Breakdown</h3>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No transport entries yet.</p>
      ) : (
        <div className="space-y-3">
          {categories.map(([cat, amt]) => {
            const dotClass = TRANSPORT_COLORS[cat] || 'bg-gray-400';
            const pct = total > 0 ? (amt / total) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotClass} shrink-0`} />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{pct.toFixed(0)}%</span>
                    <span className="text-sm font-semibold text-gray-800">{formatCurrency(amt)}</span>
                  </div>
                </div>
                <div className="bg-pink-50 rounded-full h-1.5 overflow-hidden ml-5">
                  <div
                    className={`h-1.5 rounded-full ${dotClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="border-t border-pink-100 pt-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Total Transport</span>
            <span className="text-base font-bold text-gray-800">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
