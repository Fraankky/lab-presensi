import { useEffect, useRef, useState } from 'react';
import { useFaceDetector } from '../../hooks/useFaceDetector';
import { initializeTensorFlow } from '../../utils/tfSetup';
import { transformCoordinates } from '../../utils/coordinateTransform';
import { validateAlignment } from '../../utils/faceAlignment';
import { drawGuideOverlay, drawFaceBoundingBox } from '../../utils/canvasDrawing';
import { parseFaceDetection } from '../../utils/parseFaceDetection';
import { cropAndResizeFace } from '../../utils/imageCropping';
import type { AlignmentGuide } from '../../types/faceDetection.types';

interface CameraFeedProps {
  onCameraReady?: (video: HTMLVideoElement, canvas: HTMLCanvasElement) => void;
  onCameraError?: (error: string) => void;
  onFaceCaptured?: (image: Blob) => void;
  onAlignmentUpdate?: (result: { isAligned: boolean; feedback: string; score: number } | null) => void;
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
  const [isVideoReady, setIsVideoReady] = useState(false);
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

  // Initialize camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready
          await new Promise<void>((resolve) => {
            const video = videoRef.current!;
            
            const onLoadedData = () => {
              if (video.videoWidth > 0 && video.videoHeight > 0) {
                console.log('✅ Video loaded:', {
                  dimensions: `${video.videoWidth}x${video.videoHeight}`,
                  readyState: video.readyState
                });
                video.removeEventListener('loadeddata', onLoadedData);
                resolve();
              }
            };

            video.addEventListener('loadeddata', onLoadedData);
          });

          // Play video
          await videoRef.current.play();
          
          console.log('✅ Video is playing');
          setIsVideoReady(true);
          setIsLoading(false);

          if (canvasRef.current) {
            onCameraReady?.(videoRef.current, canvasRef.current);
          }
        }
      } catch (error) {
        console.error('Camera error:', error);
        setHasError(true);
        setIsLoading(false);
        onCameraError?.(error instanceof Error ? error.message : 'Failed to access camera');
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCameraReady, onCameraError]);

  // Face detection loop - Only runs when both TF and video are ready
  useEffect(() => {
    if (!isTfReady || !isVideoReady || !videoRef.current || !overlayCanvasRef.current || !canvasRef.current) {
      console.log('⏳ Waiting for initialization...', { isTfReady, isVideoReady });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;

    // Set canvas sizes
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        overlayCanvas.width = rect.width;
        overlayCanvas.height = rect.height;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Define alignment guide
    const guide: AlignmentGuide = {
      x: overlayCanvas.width / 2,
      y: overlayCanvas.height * 0.45,
      width: overlayCanvas.width * 0.65,
      height: overlayCanvas.height * 0.75,
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
      }, 1000) as unknown as number;
    };

    const captureFace = async () => {
      try {
        const imageBlob = await cropAndResizeFace(video, guide);
        onFaceCaptured?.(imageBlob);
        setCountdown(null);
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      } catch (error) {
        console.error('Capture error:', error);
      }
    };

    // Draw video frame to canvas
    const drawVideoFrame = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !video.videoWidth || !video.videoHeight) return;

      // Calculate scaling to maintain aspect ratio
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      const canvasAspectRatio = canvas.width / canvas.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (videoAspectRatio > canvasAspectRatio) {
        // Video is wider - fit to height
        drawHeight = canvas.height;
        drawWidth = drawHeight * videoAspectRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        // Video is taller - fit to width
        drawWidth = canvas.width;
        drawHeight = drawWidth / videoAspectRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      // Clear and draw video frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
    };

    const detectLoop = async () => {
      try {
        // Validate video is still ready
        // if (video.readyState !== 4 || video.paused || video.currentTime === 0) {
        //   console.warn('⚠️ Video not ready in loop:', {
        //     readyState: video.readyState,
        //     paused: video.paused,
        //     currentTime: video.currentTime
        //   });
        //   return;
        // }

        // Draw video frame
        drawVideoFrame();

        // PENTING: Pass canvas (bukan video) ke detectFaces
        // Karena TFJS runtime lebih reliable dengan canvas input
        const faces = await detectFaces(canvas);
        
        // Clear overlay canvas
        const ctx = overlayCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
        
        // Skip jika tidak ada face atau face invalid
        if (faces.length === 0) {
          onAlignmentUpdate?.({
            isAligned: false,
            feedback: 'Wajah tidak terdeteksi',
            score: 0
          });
          drawGuideOverlay(overlayCanvas, guide, 'red');
          return;
        }
        
        const parsedFace = parseFaceDetection(faces[0]);
        
        const transformedFace = transformCoordinates(
          parsedFace,
          canvas.width,
          canvas.height,
          overlayCanvas.width,
          overlayCanvas.height
        );

        const alignment = validateAlignment(transformedFace, guide, overlayCanvas.width);
        onAlignmentUpdate?.(alignment);

        console.log('Alignment:', alignment);

        const guideColor = alignment.isAligned ? 'green' : alignment.score > 50 ? 'yellow' : 'red';
        drawGuideOverlay(overlayCanvas, guide, guideColor);
        drawFaceBoundingBox(overlayCanvas, transformedFace);

        if (alignment.isAligned && countdown === null) {
          startCountdown();
        }
      } catch (error) {
        console.error('Detection loop error:', error);
      }
    };

    console.log('🚀 Starting detection loop...');
    detectionIntervalRef.current = setInterval(detectLoop, 100) as unknown as number;

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isTfReady, isVideoReady, detectFaces, onAlignmentUpdate, onFaceCaptured, countdown]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">⚠️ Gagal mengakses kamera</p>
          <p className="text-sm text-gray-400">Pastikan kamera terhubung dan izin diberikan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
          <div className="text-center">
            <p className="text-xl mb-2">⏳ Memuat kamera...</p>
            <p className="text-sm text-gray-400">Mohon tunggu sebentar</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain"
      />

      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-9xl font-bold text-white drop-shadow-2xl">
            {countdown}
          </div>
        </div>
      )}
    </div>
  );
}