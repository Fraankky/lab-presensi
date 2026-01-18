interface ViewInitialProps {
  feedback?: string;
}

export function ViewInitial({ feedback }: ViewInitialProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-zinc-900">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 py-2">Status Sistem</h2>
        </div>
        <p className="text-m text-zinc-800 font-medium">Kamera Siap Memindai</p>
        {feedback && (
          <p className="text-sm text-amber-600 font-medium">{feedback}</p>
        )}
        <p className="text-s text-zinc-400 leading-relaxed tracking-tight ">
          Pastikan wajah terlihat jelas dan pencahayaan cukup terang.
        </p>
      </div>
    </div>
  );
}
