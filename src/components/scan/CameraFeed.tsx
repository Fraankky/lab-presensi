import { useEffect, useRef, useState } from 'react';
import { initializeCamera, stopCamera } from '../../utils/camera';

interface CameraFeedProps {
  isColored: boolean;
  onCameraReady?: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void;
  onCameraError?: (error: string) => void;
}

export function CameraFeed({onCameraReady, onCameraError }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const setupCamera = async () => {
      try {
        const stream = await initializeCamera();

        if (!mounted) {
          stopCamera(stream);
          return;
        }

        if (videoRef.current && canvasRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;

          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false);
            if (videoRef.current && canvasRef.current && onCameraReady) {
              onCameraReady(videoRef.current, canvasRef.current);
            }
          };
        }
      } catch (error) {
        if (mounted) {
          setIsLoading(false);
          setHasError(true);
          const errorMessage = error instanceof Error ? error.message : 'Camera error';
          onCameraError?.(errorMessage);
        }
      }
    };

    setupCamera();

    return () => {
      mounted = false;
      stopCamera(streamRef.current);
    };
  }, [onCameraReady, onCameraError]);

  if (hasError) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-900">
        <div className="text-center text-white px-4">
          <p className="text-sm mb-2">Tidak dapat mengakses kamera</p>
          <p className="text-xs text-zinc-400">Pastikan izin kamera telah diberikan</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Memulai kamera...</p>
          </div>
        </div>
      )}
    </>
  );
}
