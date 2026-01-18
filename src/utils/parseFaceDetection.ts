import type { FaceDetectionResult } from '../types/faceDetection.types';

interface MediaPipeFaceDetection {
  box: {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    width: number;
    height: number;
  };
  keypoints: Array<{
    x: number;
    y: number;
    name?: string;
  }>;
  score?: number;
}

export function parseFaceDetection(face: MediaPipeFaceDetection): FaceDetectionResult {
  return {
    boundingBox: {
      xMin: face.box.xMin,
      yMin: face.box.yMin,
      xMax: face.box.xMax,
      yMax: face.box.yMax,
      width: face.box.width,
      height: face.box.height,
    },
    keypoints: face.keypoints || [],
    score: face.score,
  };
}
