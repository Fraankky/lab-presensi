import { Icon } from '../ui/Icon';

interface ViewErrorProps {
  onRetry: () => void;
}

export function ViewError({ onRetry }: ViewErrorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 bg-red-50/50 border border-red-100 rounded-md flex items-start gap-3">
        <div className="mt-0.5">
          <Icon name="alert-circle" width={16} className="text-red-600" />
        </div>
        <div>
          <p className="text-m font-medium text-red-800 mb-1">Wajah Tidak Dikenali</p>
          <p className="text-xs text-red-600/80 leading-relaxed">
            Sistem tidak dapat mencocokkan wajah anda. Silakan coba lagi.
          </p>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-s font-medium h-9 rounded-md transition-all shadow-sm"
      >
        <Icon name="refresh-cw" width={14} />
        Coba Lagi
      </button>
    </div>
  );
}
