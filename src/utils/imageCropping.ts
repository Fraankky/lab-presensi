import type { AlignmentGuide } from '../types/faceDetection.types';

export async function cropAndResizeFace(
  video: HTMLVideoElement,
  guide: AlignmentGuide,
  canvasWidth: number,
  canvasHeight: number,
  targetWidth: number = 300,
  targetHeight: number = 400
): Promise<Blob> {

  // Create temporary canvas
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d')!;

  // Transform guide coordinates from canvas space to video space
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  // Calculate how video is scaled/positioned in canvas (same logic as drawVideoFrame)
  const videoAspectRatio = videoWidth / videoHeight;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

  if (videoAspectRatio > canvasAspectRatio) {
    // Video is wider - fit to height
    drawHeight = canvasHeight;
    drawWidth = drawHeight * videoAspectRatio;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    // Video is taller - fit to width
    drawWidth = canvasWidth;
    drawHeight = drawWidth / videoAspectRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  // Scale factor from canvas to video
  const scaleX = videoWidth / drawWidth;
  const scaleY = videoHeight / drawHeight;

  // Guide coordinates in canvas space
  const guideLeftCanvas = guide.x - guide.width / 2;
  const guideTopCanvas = guide.y - guide.height / 2;

  // Transform to video space
  const sourceX = (guideLeftCanvas - offsetX) * scaleX;
  const sourceY = (guideTopCanvas - offsetY) * scaleY;
  const sourceWidth = guide.width * scaleX;
  const sourceHeight = guide.height * scaleY;

  // Set temp canvas size
  tempCanvas.width = sourceWidth;
  tempCanvas.height = sourceHeight;

  // Draw cropped area from video (using transformed coordinates)
  ctx.drawImage(
    video,
    sourceX, sourceY, sourceWidth, sourceHeight, // Source (video space)
    0, 0, sourceWidth, sourceHeight // Destination
  );

  // Resize to target dimensions
  const resizeCanvas = document.createElement('canvas');
  const resizeCtx = resizeCanvas.getContext('2d')!;
  resizeCanvas.width = targetWidth;
  resizeCanvas.height = targetHeight;

  resizeCtx.drawImage(
    tempCanvas,
    0, 0, sourceWidth, sourceHeight,
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