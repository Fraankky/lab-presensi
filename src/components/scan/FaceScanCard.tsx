import { useState } from 'react';
import { CameraFeed } from './CameraFeed';
import { ScanOverlays } from './ScanOverlays';
import { LoadingOverlay } from './LoadingOverlay';
import { ViewInitial } from './ViewInitial';
import { ViewSuccess } from './ViewSuccess';
import { ViewError } from './ViewError';
import { FooterBar } from './FooterBar';

type ScanState = 'initial' | 'loading' | 'success' | 'error';

export function FaceScanCard() {
  const [scanState, setScanState] = useState<ScanState>('initial');
  const [isCameraColored, setIsCameraColored] = useState(false);

  const handleScanSuccess = () => {
    setScanState('loading');
    setTimeout(() => {
      setScanState('success');
      setIsCameraColored(true);
    }, 1500);
  };

  const handleScanError = () => {
    setScanState('loading');
    setTimeout(() => {
      setScanState('error');
    }, 1500);
  };

  const handleReset = () => {
    setScanState('initial');
    setIsCameraColored(false);
  };

  const isScanning = scanState === 'initial';
  const isSuccess = scanState === 'success';
  const isError = scanState === 'error';
  const isLoading = scanState === 'loading';

  return (
    <>
      {/* Header / Brand */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Presensi Praktikum</h1>
        <h6 className="text-md font-stretch-expanded tracking-tight text-zinc-500">Pastikan Wajah Anda Terlihat Jelas</h6>
      </header>

      {/* Card Component */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Camera Preview Section */}
        <div className="relative bg-zinc-900 aspect-video w-full overflow-hidden flex flex-col items-center justify-center group min-h-120">
          <CameraFeed isColored={isCameraColored} />
          <ScanOverlays isScanning={isScanning} isSuccess={isSuccess} isError={isError} />
          <LoadingOverlay isVisible={isLoading} />
        </div>

        {/* Content Area */}
        <div className="p-8 max-w-lg mx-auto">
          {scanState === 'initial' && (
            <ViewInitial onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
          )}

          {scanState === 'success' && (
            <ViewSuccess onReset={handleReset} />
          )}

          {scanState === 'error' && (
            <ViewError onRetry={handleReset} />
          )}
        </div>

        {/* Footer Status Bar */}
        <FooterBar />
      </div>
    </>
  );
}
