import FoodSummaryCard from './FoodSummaryCard';
import TransportBreakdownCard from './TransportBreakdownCard';
import PerDayTable from './PerDayTable';
import GrandTotalCard from './GrandTotalCard';

export default function SummaryView({ days }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FoodSummaryCard days={days} />
        <TransportBreakdownCard days={days} />
      </div>
      <PerDayTable days={days} />
      <GrandTotalCard days={days} />
    </div>
  );
}
