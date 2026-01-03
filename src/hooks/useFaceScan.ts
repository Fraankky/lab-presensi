import { useMutation } from '@tanstack/react-query';
import { scanFaceAPI } from '../api/faceScan';
import type { ScanFaceRequest, ScanFaceResponse } from '../types/scan.types';

export const useFaceScan = () => {
  const mutation = useMutation<ScanFaceResponse, Error, ScanFaceRequest>({
    mutationFn: scanFaceAPI,
    onSuccess: (data) => {
      console.log('✅ Scan successful:', data);
    },
    onError: (error) => {
      console.error('❌ Scan failed:', error.message);
    },
  });

  return {
    scanFace: mutation.mutate,
    scanFaceAsync: mutation.mutateAsync,
    isScanning: mutation.isPending,
    scanResult: mutation.data,
    scanError: mutation.error,
    reset: mutation.reset,
  };
};
