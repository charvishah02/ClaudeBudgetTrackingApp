import { FOOD_BUDGET_PER_DAY, NUM_DAYS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';

export default function FoodSummaryCard({ days }) {
  const totalBudget = FOOD_BUDGET_PER_DAY * NUM_DAYS;
  const totalSpent = days.reduce(
    (acc, day) => acc + day.food.reduce((s, e) => s + e.amount, 0),
    0
  );
  const remaining = totalBudget - totalSpent;
  const isOver = remaining < 0;

  return (
    <div className="bg-white border border-pink-200 rounded-xl shadow-sm p-5">
      <h3 className="text-pink-600 font-semibold text-base mb-4">Food Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total Spent</span>
          <span className="text-sm font-bold text-gray-800">{formatCurrency(totalSpent)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total Budget</span>
          <span className="text-sm font-bold text-gray-800">{formatCurrency(totalBudget)}</span>
        </div>
        <div className="border-t border-pink-100 pt-3 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">
            {isOver ? 'Over Budget' : 'Budget Remaining'}
          </span>
          <span className={`text-base font-bold ${isOver ? 'text-red-500' : 'text-green-600'}`}>
            {isOver
              ? '$' + Math.abs(remaining).toFixed(2) + ' over'
              : formatCurrency(remaining)}
          </span>
        </div>
        {/* Mini progress bar */}
        <div className="bg-pink-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full ${isOver ? 'bg-red-400' : 'bg-pink-400'}`}
            style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right">
          {Math.min((totalSpent / totalBudget) * 100, 100).toFixed(0)}% of ${totalBudget} budget used
        </p>
      </div>
    </div>
  );
}
