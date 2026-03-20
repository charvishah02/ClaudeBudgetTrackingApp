export default function MetricCard({ label, value, valueClassName = '' }) {
  return (
    <div className="bg-white border border-pink-200 rounded-xl shadow-sm p-4 flex flex-col items-center text-center">
      <span className="text-xs font-semibold text-pink-400 uppercase tracking-wide mb-1">
        {label}
      </span>
      <span className={`text-2xl font-bold ${valueClassName || 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  );
}
