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
