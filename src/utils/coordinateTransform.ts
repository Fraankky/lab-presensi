import type { FaceDetectionResult } from '../types/faceDetection.types';

export function transformCoordinates(
  face: FaceDetectionResult,
  videoWidth: number,
  videoHeight: number,
  canvasWidth: number,
  canvasHeight: number
): FaceDetectionResult {

  // Calculate aspect ratios
  const videoAspectRatio = videoWidth / videoHeight;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let scaleX: number;
  let scaleY: number;
  let offsetX = 0;
  let offsetY = 0;

  if (videoAspectRatio > canvasAspectRatio) {
    // Video lebih lebar - fit to height
    scaleY = canvasHeight / videoHeight;
    scaleX = scaleY;
    offsetX = (canvasWidth - videoWidth * scaleX) / 2;
  } else {
    // Video lebih tinggi - fit to width
    scaleX = canvasWidth / videoWidth;
    scaleY = scaleX;
    offsetY = (canvasHeight - videoHeight * scaleY) / 2;
  }

  // Transform bounding box
  const transformedBox = {
    xMin: face.boundingBox.xMin * scaleX + offsetX,
    yMin: face.boundingBox.yMin * scaleY + offsetY,
    xMax: face.boundingBox.xMax * scaleX + offsetX,
    yMax: face.boundingBox.yMax * scaleY + offsetY,
    width: face.boundingBox.width * scaleX,
    height: face.boundingBox.height * scaleY,
  };

  // Transform keypoints
  const transformedKeypoints = face.keypoints.map(kp => ({
    x: kp.x * scaleX + offsetX,
    y: kp.y * scaleY + offsetY,
    name: kp.name,
  }));

  return {
    boundingBox: transformedBox,
    keypoints: transformedKeypoints,
    score: face.score,
  };
}