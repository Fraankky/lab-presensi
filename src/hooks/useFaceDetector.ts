import * as faceDetection from '@tensorflow-models/face-detection';
import { useRef, useCallback } from 'react';

export function useFaceDetector() {
  const detectorRef = useRef<faceDetection.FaceDetector | null>(null);

  const loadModel = useCallback(async () => {
    try {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;

      const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig = {
        runtime: 'tfjs', // Gunakan TFJS runtime
        maxFaces: 1, // Untuk presensi, cukup 1 wajah
      };

      detectorRef.current = await faceDetection.createDetector(
        model,
        detectorConfig
      );

      console.log('✅ Face detector loaded');
      return true;
    } catch (error) {
      console.error('❌ Failed to load face detector:', error);
      return false;
    }
  }, []);

  const detectFaces = useCallback(async (
    video: HTMLVideoElement
  ): Promise<faceDetection.Face[]> => {

    if (!detectorRef.current) {
      throw new Error('Detector not loaded');
    }

    // Pastikan video ready
    if (video.readyState < 2) {
      return [];
    }

    try {
      // Estimation config
      const estimationConfig: faceDetection.MediaPipeFaceDetectorTfjsEstimationConfig = {
        flipHorizontal: false, // Set true jika pakai front camera
      };

      // Detect faces
      const faces = await detectorRef.current.estimateFaces(
        video,
        estimationConfig
      );

      return faces;
    } catch (error) {
      console.error('Detection error:', error);
      return [];
    }
  }, []);

  return { detectorRef, loadModel, detectFaces };
}