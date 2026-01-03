import { Icon } from '../ui/Icon';

interface ViewInitialProps {
  onScanSuccess: () => void;
  onScanError: () => void;
}

export function ViewInitial({ onScanSuccess, onScanError }: ViewInitialProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-zinc-900">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 py-3">Status Sistem</h2>
        </div>
        <p className="text-m text-zinc-800 font-medium">Kamera Siap Memindai</p>
        <p className="text-s text-zinc-500 leading-relaxed">
          Pastikan wajah terlihat jelas dan pencahayaan cukup terang.
        </p>
      </div>

      <button
        onClick={onScanSuccess}
        className="group relative w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium h-9 rounded-md transition-all focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 shadow-sm"
      >
        <Icon name="camera" width={16} />
        Konfirmasi Kehadiran
      </button>

      <button
        onClick={onScanError}
        className="text-xs text-zinc-300 hover:text-zinc-400 text-center w-full"
      >
        Simulasi Gagal (Demo)
      </button>
    </div>
  );
}
