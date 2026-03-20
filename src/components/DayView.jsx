import MetricCard from './MetricCard';
import FoodProgressBar from './FoodProgressBar';
import EntryList from './EntryList';
import AddEntryForm from './AddEntryForm';
import { FOOD_BUDGET_PER_DAY, FOOD_CATEGORIES, TRANSPORT_CATEGORIES } from '../constants';
import { sumAmounts, formatCurrency, formatFoodLeft } from '../utils/formatters';

export default function DayView({ dayIndex, day, onAddEntry, onDeleteEntry }) {
  const foodSpent = sumAmounts(day.food);
  const transportSpent = sumAmounts(day.transport);
  const isOverBudget = foodSpent > FOOD_BUDGET_PER_DAY;
  const foodLeftValue = formatFoodLeft(foodSpent, FOOD_BUDGET_PER_DAY);

  return (
    <div className="space-y-5">
      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Food Spent"
          value={formatCurrency(foodSpent)}
          valueClassName="text-gray-800"
        />
        <MetricCard
          label="Food Left"
          value={foodLeftValue}
          valueClassName={isOverBudget ? 'text-red-500' : 'text-green-600'}
        />
        <MetricCard
          label="Transport"
          value={formatCurrency(transportSpent)}
          valueClassName="text-gray-800"
        />
      </div>

      {/* Food budget progress bar */}
      <FoodProgressBar spent={foodSpent} />

      {/* Food section */}
      <div className="bg-white border border-pink-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="text-pink-600 font-semibold text-base">Food</h3>
          <span className="text-xs text-gray-400">
            Budget: ${FOOD_BUDGET_PER_DAY}.00 / day
          </span>
        </div>
        <div className="px-2 pb-2">
          <EntryList
            entries={day.food}
            onDelete={(id) => onDeleteEntry(dayIndex, 'food', id)}
            emptyMessage="No food entries yet. Add one below."
          />
        </div>
        <div className="border-t border-pink-100 px-4 py-3">
          <AddEntryForm
            categories={FOOD_CATEGORIES}
            onAdd={(entry) => onAddEntry(dayIndex, 'food', entry)}
            placeholder="e.g. Coffee at airport"
          />
        </div>
      </div>

      {/* Transport section */}
      <div className="bg-white border border-pink-200 rounded-xl shadow-sm">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-pink-600 font-semibold text-base">Transport</h3>
        </div>
        <div className="px-2 pb-2">
          <EntryList
            entries={day.transport}
            onDelete={(id) => onDeleteEntry(dayIndex, 'transport', id)}
            emptyMessage="No transport entries yet. Add one below."
          />
        </div>
        <div className="border-t border-pink-100 px-4 py-3">
          <AddEntryForm
            categories={TRANSPORT_CATEGORIES}
            onAdd={(entry) => onAddEntry(dayIndex, 'transport', entry)}
            placeholder="e.g. Uber to hotel"
          />
        </div>
      </div>
    </div>
  );
}
