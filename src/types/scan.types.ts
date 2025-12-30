export type ScanState = 'idle' | 'ready' | 'verifying' | 'success' | 'error';

export interface ScanResult {
  match: boolean;
  confidence?: number;
  user?: {
    nim: string;
    nama: string;
  };
  message?: string;
}

export interface ScanFaceRequest {
  image: Blob;
}

export interface ScanFaceResponse {
  match: boolean;
  confidence?: number;
  user?: {
    nim: string;
    nama: string;
  };
}
