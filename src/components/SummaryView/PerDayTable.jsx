import { FOOD_BUDGET_PER_DAY } from '../../constants';
import { formatCurrency, formatFoodLeft } from '../../utils/formatters';

export default function PerDayTable({ days }) {
  return (
    <div className="bg-white border border-pink-200 rounded-xl shadow-sm p-5">
      <h3 className="text-pink-600 font-semibold text-base mb-4">Per-Day Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pink-100">
              <th className="text-left text-pink-400 font-semibold pb-2 pr-4">Day</th>
              <th className="text-right text-pink-400 font-semibold pb-2 px-4">Food Spent</th>
              <th className="text-right text-pink-400 font-semibold pb-2 px-4">Food Left</th>
              <th className="text-right text-pink-400 font-semibold pb-2 pl-4">Transport</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => {
              const foodSpent = day.food.reduce((acc, e) => acc + e.amount, 0);
              const transportSpent = day.transport.reduce((acc, e) => acc + e.amount, 0);
              const isOver = foodSpent > FOOD_BUDGET_PER_DAY;
              const foodLeft = formatFoodLeft(foodSpent, FOOD_BUDGET_PER_DAY);

              return (
                <tr
                  key={i}
                  className={`border-b border-pink-50 last:border-0 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-pink-50/30'
                  }`}
                >
                  <td className="py-3 pr-4 font-medium text-gray-700">Day {i + 1}</td>
                  <td className="py-3 px-4 text-right text-gray-800 font-medium">
                    {formatCurrency(foodSpent)}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${isOver ? 'text-red-500' : 'text-green-600'}`}>
                    {foodLeft}
                  </td>
                  <td className="py-3 pl-4 text-right text-gray-800 font-medium">
                    {formatCurrency(transportSpent)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-pink-200">
              <td className="pt-3 pr-4 font-bold text-gray-700">Total</td>
              <td className="pt-3 px-4 text-right font-bold text-gray-800">
                {formatCurrency(
                  days.reduce(
                    (acc, day) => acc + day.food.reduce((s, e) => s + e.amount, 0),
                    0
                  )
                )}
              </td>
              <td className="pt-3 px-4 text-right text-gray-400 text-xs italic">—</td>
              <td className="pt-3 pl-4 text-right font-bold text-gray-800">
                {formatCurrency(
                  days.reduce(
                    (acc, day) => acc + day.transport.reduce((s, e) => s + e.amount, 0),
                    0
                  )
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
