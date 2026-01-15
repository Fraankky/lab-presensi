import type { FaceDetectionResult, AlignmentGuide } from '../types/faceDetection.types';

export function drawGuideOverlay(
  canvas: HTMLCanvasElement,
  guide: AlignmentGuide,
  color: 'red' | 'yellow' | 'green'
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set guide style
  const colors = {
    red: 'rgba(255, 0, 0, 0.5)',
    yellow: 'rgba(255, 255, 0, 0.5)',
    green: 'rgba(0, 255, 0, 0.5)',
  };

  ctx.strokeStyle = colors[color];
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 5]); // Dashed line

  // Draw oval guide
  const centerX = guide.x;
  const centerY = guide.y;
  const radiusX = guide.width / 2;
  const radiusY = guide.height / 2;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw helper text
  ctx.setLineDash([]); // Reset dash
  ctx.font = '16px Arial';
  ctx.fillStyle = colors[color];
  ctx.textAlign = 'center';
  ctx.fillText('Posisikan wajah di sini', centerX, centerY - radiusY - 30);
}

export function drawFaceBoundingBox(
  canvas: HTMLCanvasElement,
  face: FaceDetectionResult
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { boundingBox, keypoints } = face;

  // Draw bounding box
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    boundingBox.xMin,
    boundingBox.yMin,
    boundingBox.width,
    boundingBox.height
  );

  // Draw keypoints
  keypoints.forEach(kp => {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(kp.x, kp.y, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Label keypoint
    if (kp.name) {
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.fillText(kp.name, kp.x + 5, kp.y - 5);
    }
  });
}