import type { ScanFaceRequest } from "../types/scan.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const scanFaceAPI = async (request: ScanFaceRequest): Promise<ScanFaceRequest> => {
    const formData = new FormData();
    formData.append('image', request.image, 'face.jpg');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`${API_BASE_URL}/api/scan-face`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok){
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Request failed with status ${response.status}: ${errorData.message}`);
        }
        return response.json();
    } catch(error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }

}
