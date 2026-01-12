import { FaceScanCard } from '../components/scan';
import { AttendanceListCard } from '../components/scan';

export function App() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <FaceScanCard />
        </div>
        <div className="flex-1 mt-20">
          <AttendanceListCard />
        </div>
      </div>
    </div>
  );
}
