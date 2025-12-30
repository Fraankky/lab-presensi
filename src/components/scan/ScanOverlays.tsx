import { Icon } from '../ui/Icon';

interface ScanOverlaysProps {
  isScanning: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function ScanOverlays({ isScanning, isSuccess, isError }: ScanOverlaysProps) {
  return (
    <>
      {/* State: Scanning Overlay */}
      <div
        id="overlay-scanning"
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          !isScanning && !isSuccess && !isError ? 'flex' : 'opacity-0'
        }`}
      >
        <div className="relative w-40 h-40">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/80 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/80 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/80 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/80 rounded-br-lg"></div>
          <div className="scan-line"></div>
        </div>
        <div className="absolute bottom-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
          <p className="text-[10px] font-medium text-white/90">Posisikan wajah di dalam bingkai</p>
        </div>
      </div>

      {/* State: Success Overlay */}
      <div
        id="overlay-success"
        className={`absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] transition-all duration-500 ${
          isSuccess ? 'flex' : 'hidden'
        } flex-col items-center justify-center`}
      >
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 shadow-sm animate-bounce]">
          <Icon name="check" width={24} strokeWidth={2} className="text-emerald-600" />
        </div>
      </div>

      {/* State: Error Overlay */}
      <div
        id="overlay-error"
        className={`absolute inset-0 bg-red-500/10 backdrop-blur-[2px] transition-all duration-500 ${
          isError ? 'flex' : 'hidden'
        } flex-col items-center justify-center`}
      >
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 shadow-sm">
          <Icon name="x" width={24} strokeWidth={2} className="text-red-600" />
        </div>
      </div>
    </>
  );
}
