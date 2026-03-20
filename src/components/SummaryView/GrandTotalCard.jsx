import { formatCurrency } from '../../utils/formatters';

export default function GrandTotalCard({ days }) {
  const totalFood = days.reduce(
    (acc, day) => acc + day.food.reduce((s, e) => s + e.amount, 0),
    0
  );
  const totalTransport = days.reduce(
    (acc, day) => acc + day.transport.reduce((s, e) => s + e.amount, 0),
    0
  );
  const grandTotal = totalFood + totalTransport;

  return (
    <div className="bg-pink-500 text-white rounded-xl shadow-md p-6">
      <h3 className="text-white/80 font-semibold text-base mb-5 uppercase tracking-wide text-sm">
        Grand Total
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/80 text-sm">Total Food</span>
          <span className="text-white font-semibold text-base">{formatCurrency(totalFood)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/80 text-sm">Total Transport</span>
          <span className="text-white font-semibold text-base">{formatCurrency(totalTransport)}</span>
        </div>
        <div className="border-t border-white/30 pt-4 flex justify-between items-center">
          <span className="text-white font-bold text-lg">Grand Total</span>
          <span className="text-white font-extrabold text-2xl">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
