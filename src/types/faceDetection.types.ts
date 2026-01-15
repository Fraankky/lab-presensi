export interface FaceDetectionResult {
  boundingBox: {
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
    name?: string; // 'leftEye', 'rightEye', 'noseTip', etc.
  }>;
  score?: number; // Detection confidence (MediaPipe only)
}

export interface AlignmentGuide {
  x: number; // Center X
  y: number; // Center Y
  width: number;
  height: number;
}

export interface AlignmentResult {
  isAligned: boolean;
  score: number; // 0-100
  feedback: string;
  checks: {
    inGuide: boolean;
    rightSize: boolean;
    centered: boolean;
    eyesHorizontal: boolean;
  };
}