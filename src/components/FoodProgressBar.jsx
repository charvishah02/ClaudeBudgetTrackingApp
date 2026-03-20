import { FOOD_BUDGET_PER_DAY } from '../constants';

export default function FoodProgressBar({ spent }) {
  const isOver = spent > FOOD_BUDGET_PER_DAY;
  const pct = Math.min((spent / FOOD_BUDGET_PER_DAY) * 100, 100);

  return (
    <div className="bg-white border border-pink-200 rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-pink-600">Food Budget Progress</span>
        <span className={`text-sm font-bold ${isOver ? 'text-red-500' : 'text-gray-700'}`}>
          ${spent.toFixed(2)} / ${FOOD_BUDGET_PER_DAY}.00
        </span>
      </div>
      <div className="bg-pink-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            isOver ? 'bg-red-500' : 'bg-pink-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">$0</span>
        <span className={`text-xs font-medium ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
          {pct.toFixed(0)}%{isOver ? ' — over budget!' : ''}
        </span>
        <span className="text-xs text-gray-400">${FOOD_BUDGET_PER_DAY}</span>
      </div>
    </div>
  );
}
