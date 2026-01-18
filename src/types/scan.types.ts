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
