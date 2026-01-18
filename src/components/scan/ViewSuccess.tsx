import { Icon } from '../ui/Icon';
import type { ScanFaceResponse } from '../../types/scan.types';

interface ViewSuccessProps {
  onReset: () => void;
  scanResult: ScanFaceResponse;
}

export function ViewSuccess({ onReset, scanResult }: ViewSuccessProps) {
  const userName = scanResult.user?.nama || 'Tidak diketahui';
  const userNim = scanResult.user?.nim || 'Tidak diketahui';

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-md flex items-start gap-3">
        <div className="mt-0.5">
          <Icon name="check-circle-2" width={16} className="text-emerald-600" />
        </div>
        <div className="space-y-2 w-full">
          <div>
            <p className="text-s font-medium text-emerald-800 mb-0.5">Verifikasi Berhasil</p>
            <p className="text-xs text-emerald-600/80">Data kehadiran tersimpan.</p>
          </div>

          <div className="pt-2 border-t border-emerald-200/50 grid grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-600/70 font-medium mb-0.5">
                Nama
              </p>
              <p className="text-s font-medium text-zinc-800">{userName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-600/70 font-medium mb-0.5">
                NIM
              </p>
              <p className="text-s font-mono text-zinc-600">{userNim}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-zinc-700 text-s font-medium h-9 rounded-md transition-colors focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Kembali ke Dashboard
        </button>
        <button
          onClick={onReset}
          className="w-full text-xs text-zinc-400 hover:text-zinc-600"
        >
          Scan Wajah Lain
        </button>
      </div>
    </div>
  );
}
