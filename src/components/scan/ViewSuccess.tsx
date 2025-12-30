import { Icon } from '../ui/Icon';

interface ViewSuccessProps {
  onReset: () => void;
}

export function ViewSuccess({ onReset }: ViewSuccessProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-md flex items-start gap-3">
        <div className="mt-0.5">
          <Icon name="check-circle-2" width={16} className="text-emerald-600" />
        </div>
        <div className="space-y-2 w-full">
          <div>
            <p className="text-xs font-medium text-emerald-800 mb-0.5">Verifikasi Berhasil</p>
            <p className="text-[10px] text-emerald-600/80">Data kehadiran tersimpan.</p>
          </div>

          <div className="pt-2 border-t border-emerald-200/50 grid grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-emerald-600/70 font-medium mb-0.5">
                Nama
              </p>
              <p className="text-xs font-medium text-zinc-800">Budi Santoso</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-emerald-600/70 font-medium mb-0.5">
                NIM
              </p>
              <p className="text-xs font-mono text-zinc-600">A11.2024.123</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-zinc-700 text-xs font-medium h-9 rounded-md transition-colors focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Kembali ke Dashboard
        </button>
        <button
          onClick={onReset}
          className="w-full text-[10px] text-zinc-400 hover:text-zinc-600"
        >
          Scan Wajah Lain
        </button>
      </div>
    </div>
  );
}
