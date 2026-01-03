export const captureFrame = (
  videoElement: HTMLVideoElement,
  canvasElement: HTMLCanvasElement
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const context = canvasElement.getContext('2d');

    if (!context) {
      resolve(null);
      return;
    }

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0);

    canvasElement.toBlob(
      (blob) => resolve(blob),
      'image/jpeg',
      0.95
    );
  });
};

export const initializeCamera = async (): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      }
    });
    return stream;
  } catch (error) {
    console.error('Camera initialization error:', error);
    throw new Error('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
  }
};

export const stopCamera = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};
