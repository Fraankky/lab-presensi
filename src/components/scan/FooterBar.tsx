export function FooterBar() {
  return (
    <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[10px] text-zinc-500 font-medium">Online</span>
      </div>
      <span className="text-[10px] text-zinc-400">Ver. 2.4.0</span>
    </div>
  );
}
