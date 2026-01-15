import type { AlignmentGuide } from '../types/faceDetection.types';

export async function cropAndResizeFace(
  video: HTMLVideoElement,
  guide: AlignmentGuide,
  targetWidth: number = 300,
  targetHeight: number = 400
): Promise<Blob> {

  // Create temporary canvas
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d')!;

  // Set canvas size to guide dimensions
  tempCanvas.width = guide.width;
  tempCanvas.height = guide.height;

  // Calculate source coordinates in video
  const guideLeft = guide.x - guide.width / 2;
  const guideTop = guide.y - guide.height / 2;

  // Draw cropped area from video
  ctx.drawImage(
    video,
    guideLeft, guideTop, guide.width, guide.height, // Source
    0, 0, guide.width, guide.height // Destination
  );

  // Resize to target dimensions
  const resizeCanvas = document.createElement('canvas');
  const resizeCtx = resizeCanvas.getContext('2d')!;
  resizeCanvas.width = targetWidth;
  resizeCanvas.height = targetHeight;

  resizeCtx.drawImage(
    tempCanvas,
    0, 0, guide.width, guide.height,
    0, 0, targetWidth, targetHeight
  );

  // Convert to blob
  return new Promise((resolve, reject) => {
    resizeCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/jpeg',
      0.95 // Quality
    );
  });
}