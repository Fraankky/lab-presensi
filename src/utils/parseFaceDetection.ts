import type { FaceDetectionResult } from '../types/faceDetection.types';

export function parseFaceDetection(face: any): FaceDetectionResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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