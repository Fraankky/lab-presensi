import { useEffect, useRef, useState } from 'react';
import { initializeCamera, stopCamera } from '../../utils/camera';
import { initializeTensorFlow } from '../../utils/tfSetup';
import { useFaceDetector } from '../../hooks/useFaceDetector';
import { parseFaceDetection } from '../../utils/parseFaceDetection';
import { transformCoordinates } from '../../utils/coordinateTransform';
import { validateAlignment } from '../../utils/faceAlignment';
import { drawGuideOverlay, drawFaceBoundingBox } from '../../utils/canvasDrawing';
import { cropAndResizeFace } from '../../utils/imageCropping';
import type { AlignmentGuide } from '../../types/faceDetection.types';

interface CameraFeedProps {
  isColored: boolean;
  onCameraReady?: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void;
  onCameraError?: (error: string) => void;
  onFaceCaptured?: (image: Blob) => void;
  onAlignmentUpdate?: (result: { isAligned: boolean; feedback: string; score: number }) => void;
}

export function CameraFeed({
  onCameraReady,
  onCameraError,
  onFaceCaptured,
  onAlignmentUpdate
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isTfReady, setIsTfReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const { detectFaces, loadModel } = useFaceDetector();

  // Initialize TensorFlow and face detector
  useEffect(() => {
    const initDetection = async () => {
      const tfReady = await initializeTensorFlow();
      const modelLoaded = await loadModel();
      setIsTfReady(tfReady && modelLoaded);
    };
    initDetection();
  }, [loadModel]);

  // Face detection loop
  useEffect(() => {
    if (!isTfReady || !videoRef.current || !overlayCanvasRef.current) return;

    const video = videoRef.current;
    const overlayCanvas = overlayCanvasRef.current;

    // Set overlay canvas size to match container
    const resizeCanvas = () => {
      const rect = overlayCanvas.parentElement?.getBoundingClientRect();
      if (rect) {
        overlayCanvas.width = rect.width;
        overlayCanvas.height = rect.height;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Define alignment guide (slightly above center for face, oval shape)
    const guide: AlignmentGuide = {
      x: overlayCanvas.width / 2,
      y: overlayCanvas.height * 0.45, // Slightly above center for face positioning
      width: overlayCanvas.width * 0.65,
      height: overlayCanvas.height * 0.75,
    };

    const detectLoop = async () => {
      try {
        const faces = await detectFaces(video);
        if (faces.length > 0) {
          const parsedFace = parseFaceDetection(faces[0]);
          const transformedFace = transformCoordinates(
            parsedFace,
            video.videoWidth,
            video.videoHeight,
            overlayCanvas.width,
            overlayCanvas.height
          );

          // Validate alignment
          const alignment = validateAlignment(transformedFace, guide, overlayCanvas.width);

          // Update alignment feedback
          onAlignmentUpdate?.(alignment);

          // Draw guide and face
          const guideColor = alignment.isAligned ? 'green' : alignment.score > 50 ? 'yellow' : 'red';
          drawGuideOverlay(overlayCanvas, guide, guideColor);
          drawFaceBoundingBox(overlayCanvas, transformedFace);

          // Auto-capture if aligned
          if (alignment.isAligned && !countdown) {
            startCountdown();
          }
        } else {
          // No face detected
          onAlignmentUpdate?.({
            isAligned: false,
            feedback: 'Wajah tidak terdeteksi',
            score: 0
          });
          drawGuideOverlay(overlayCanvas, guide, 'red');
        }
      } catch (error) {
        console.error('Detection loop error:', error);
      }
    };

    const startCountdown = () => {
      setCountdown(3);
      let count = 3;
      countdownRef.current = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          captureFace();
        }
      }, 1000);
    };

    const captureFace = async () => {
      if (!videoRef.current) return;
      try {
        const imageBlob = await cropAndResizeFace(video, guide);
        onFaceCaptured?.(imageBlob);
        setCountdown(null);
        clearInterval(countdownRef.current!);
      } catch (error) {
        console.error('Capture error:', error);
      }
    };

    // Start detection loop
    detectionIntervalRef.current = setInterval(detectLoop, 100);

    return () => {
      clearInterval(detectionIntervalRef.current!);
      clearInterval(countdownRef.current!);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isTfReady, detectFaces, onAlignmentUpdate, onFaceCaptured, countdown]);

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
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Countdown overlay */}
      {countdown !== null && countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center">
            <div className="text-6xl font-bold mb-2">{countdown}</div>
            <p className="text-sm">Foto akan diambil...</p>
          </div>
        </div>
      )}

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
