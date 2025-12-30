import { Icon } from '../ui/Icon';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  return (
    <div
      id="loader"
      className={`absolute inset-0 z-30 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'flex' : 'hidden'
      } flex-col items-center justify-center`}
    >
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-white/20 rounded-full pulse-circle"></div>
        <Icon name="loader-2" width={20} strokeWidth={2} className="text-white animate-spin absolute inset-0 m-auto" />
      </div>
      <p className="mt-3 text-[10px] font-medium text-white tracking-wide">Memverifikasi...</p>
    </div>
  );
}
