import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import { useRef, useCallback } from 'react';

export function useFaceDetector() {
  const detectorRef = useRef<faceDetection.FaceDetector | null>(null);

  const loadModel = useCallback(async () => {
    try {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;

      const detectorConfig: faceDetection.MediaPipeFaceDetectorTfjsModelConfig = {
        runtime: 'tfjs',
        maxFaces: 1,
      };

      console.log('⏳ Loading MediaPipe Face Detector...');
      detectorRef.current = await faceDetection.createDetector(model, detectorConfig);
      
      console.log('✅ Face detector loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to load face detector:', error);
      return false;
    }
  }, []);

  const detectFaces = useCallback(async (
    input: HTMLVideoElement | HTMLCanvasElement
  ): Promise<faceDetection.Face[]> => {

    if (!detectorRef.current) {
      console.error('❌ Detector not initialized');
      return [];
    }

    // Jika input adalah video, validasi
    if (input instanceof HTMLVideoElement) {
      if (input.readyState !== 4) {
        console.warn('⚠️ Video not ready. ReadyState:', input.readyState);
        return [];
      }

      if (input.videoWidth === 0 || input.videoHeight === 0) {
        console.warn('⚠️ Video dimensions invalid:', {
          width: input.videoWidth,
          height: input.videoHeight
        });
        return [];
      }

      if (input.currentTime === 0) {
        console.warn('⚠️ Video not playing yet. CurrentTime:', input.currentTime);
        return [];
      }
    }

    try {
      const estimationConfig: faceDetection.MediaPipeFaceDetectorTfjsEstimationConfig = {
        flipHorizontal: false,
      };

      const faces = await detectorRef.current.estimateFaces(input, estimationConfig);

      // Filter faces dengan box yang valid
      const validFaces = faces.filter(face => {
        const box = face.box;
        return box.width > 0 && box.height > 0 && box.xMax > 0 && box.yMax > 0;
      });

      if (validFaces.length > 0) {
        console.log('✅ Detected', validFaces.length, 'valid face(s)');
        console.log('📦 Box:', validFaces[0].box);
        console.log('🎯 Keypoints:', validFaces[0].keypoints.length);
      } else if (faces.length > 0) {
        console.warn('⚠️ Detected face but box is invalid (all zeros)');
      }

      return validFaces;
    } catch (error) {
      console.error('❌ Detection error:', error);
      return [];
    }
  }, []);

  return { detectorRef, loadModel, detectFaces };
}