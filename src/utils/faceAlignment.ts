import type { FaceDetectionResult, AlignmentGuide, AlignmentResult } from '../types/faceDetection.types';

export function validateAlignment(
  face: FaceDetectionResult,
  guide: AlignmentGuide,
  canvasWidth: number
): AlignmentResult {

  const { boundingBox, keypoints } = face;

  // 1. Check if face is within guide area (with 10% tolerance)
  const guideMargin = 0.1;
  const guideLeft = guide.x - guide.width / 2;
  const guideRight = guide.x + guide.width / 2;
  const guideTop = guide.y - guide.height / 2;
  const guideBottom = guide.y + guide.height / 2;

  const faceCenter = {
    x: (boundingBox.xMin + boundingBox.xMax) / 2,
    y: (boundingBox.yMin + boundingBox.yMax) / 2,
  };

  const inGuide =
    faceCenter.x > guideLeft * (1 - guideMargin) &&
    faceCenter.x < guideRight * (1 + guideMargin) &&
    faceCenter.y > guideTop * (1 - guideMargin) &&
    faceCenter.y < guideBottom * (1 + guideMargin);

  // 2. Check face size (should be 60-80% of guide height)
  const faceHeight = boundingBox.height;
  const targetHeight = guide.height;
  const sizeRatio = faceHeight / targetHeight;
  const rightSize = sizeRatio >= 0.6 && sizeRatio <= 0.8;

  // 3. Check if centered horizontally
  const horizontalCenter = canvasWidth / 2;
  const centerOffset = Math.abs(faceCenter.x - horizontalCenter);
  const centered = centerOffset < canvasWidth * 0.1; // 10% tolerance

  // 4. Check if eyes are horizontal (angle < 15°)
  const leftEye = keypoints.find(kp => kp.name === 'leftEye');
  const rightEye = keypoints.find(kp => kp.name === 'rightEye');

  let eyesHorizontal = true;
  if (leftEye && rightEye) {
    const eyeAngle = Math.abs(
      Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI)
    );
    eyesHorizontal = eyeAngle < 15;
  }

  // Calculate alignment score
  const checks = { inGuide, rightSize, centered, eyesHorizontal };
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const score = (passedChecks / 4) * 100;

  console.log("passedChecks:", passedChecks, "score:", score);

  // Generate feedback
  let feedback = 'Sempurna! 😊';
  if (!inGuide) feedback = 'Posisikan wajah di dalam kotak';
  else if (!rightSize) feedback = sizeRatio < 0.6 ? 'Dekatkan wajah' : 'Jauhkan wajah';
  else if (!centered) feedback = faceCenter.x < horizontalCenter ? 'Geser ke kanan' : 'Geser ke kiri';
  else if (!eyesHorizontal) feedback = 'Luruskan kepala';

  return {
    isAligned: passedChecks === 2,
    score,
    feedback,
    checks,
  };
}