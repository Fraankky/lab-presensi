# Implementasi TensorFlow.js Face Detection

## Ringkasan Perubahan

Implementasi deteksi wajah real-time menggunakan TensorFlow.js untuk sistem presensi praktikum. Sistem ini menggunakan MediaPipe Face Detection model untuk mendeteksi wajah, melakukan validasi alignment, dan auto-capture ketika wajah sudah dalam posisi yang tepat.

## Dependencies yang Ditambahkan

```json
{
  "@tensorflow/tfjs-core": "^latest",
  "@tensorflow/tfjs-converter": "^latest",
  "@tensorflow/tfjs-backend-webgl": "^latest",
  "@tensorflow-models/face-detection": "^latest"
}
```

## File Baru yang Dibuat

### Core Utilities

#### `src/utils/tfSetup.ts`
- Inisialisasi TensorFlow.js backend (WebGL dengan fallback CPU)
- Setup untuk performa optimal di browser

#### `src/hooks/useFaceDetector.ts`
- Hook untuk load dan manage MediaPipe Face Detection model
- Detection loop untuk real-time face detection

#### `src/types/faceDetection.types.ts`
- TypeScript interfaces untuk face detection results
- Alignment guide dan validation types

#### `src/utils/parseFaceDetection.ts`
- Parser untuk hasil deteksi dari TensorFlow.js
- Transform ke format internal aplikasi

#### `src/utils/coordinateTransform.ts`
- Transform koordinat dari video space ke canvas space
- Handling aspect ratio differences

#### `src/utils/faceAlignment.ts`
- Validasi posisi wajah terhadap guide
- Feedback untuk user guidance
- Scoring system (0-100)

#### `src/utils/canvasDrawing.ts`
- Drawing utilities untuk alignment guide overlay
- Face bounding box dan keypoints visualization

#### `src/utils/imageCropping.ts`
- Crop dan resize wajah untuk backend submission
- Optimasi ukuran gambar (300x400px default)

## File yang Dimodifikasi

### `src/components/scan/CameraFeed.tsx`
- **Perubahan Utama:**
  - Tambah TensorFlow.js initialization
  - Real-time face detection loop (100ms interval)
  - Alignment guide overlay (oval shape di center)
  - Auto-capture countdown (3 detik) ketika aligned
  - Canvas overlay untuk visual feedback

- **Props Baru:**
  - `onFaceCaptured?: (image: Blob) => void` - Callback ketika gambar berhasil di-capture
  - `onAlignmentUpdate?: (result: {isAligned: boolean, feedback: string, score: number}) => void` - Real-time alignment feedback

### `src/components/scan/FaceScanCard.tsx`
- **Perubahan:**
  - Integrasi dengan useFaceScan hook
  - State management untuk alignment feedback
  - Handle auto-capture dan scan result

### `src/components/scan/ViewInitial.tsx`
- **Props Baru:**
  - `feedback?: string` - Menampilkan alignment guidance ke user

## Arsitektur Sistem

```
CameraFeed Component
├── TensorFlow.js Backend (WebGL/CPU)
├── MediaPipe Face Detector
├── Real-time Detection Loop
│   ├── Face Detection
│   ├── Coordinate Transform
│   ├── Alignment Validation
│   └── Canvas Drawing
├── Auto-capture Logic
│   ├── Countdown Timer
│   ├── Image Cropping
│   └── Backend Submission
└── User Feedback
    ├── Alignment Guide
    ├── Status Messages
    └── Visual Indicators
```

## Flow Implementasi

1. **Initialization Phase:**
   - Load TensorFlow.js backend
   - Load MediaPipe face detection model
   - Setup camera stream

2. **Detection Phase:**
   - Capture video frame setiap 100ms
   - Detect faces menggunakan TensorFlow.js
   - Parse dan transform coordinates

3. **Validation Phase:**
   - Check face position vs alignment guide
   - Validate size, centering, dan eye alignment
   - Generate feedback message

4. **Feedback Phase:**
   - Draw guide overlay (red/yellow/green)
   - Display bounding box dan keypoints
   - Show alignment feedback text

5. **Capture Phase:**
   - Auto-start countdown ketika aligned
   - Crop dan resize wajah
   - Submit ke backend API

## Optimasi Performa

- **Backend Selection:** WebGL untuk GPU acceleration, fallback ke CPU
- **Detection Interval:** 100ms untuk balance antara accuracy dan performance
- **Model Configuration:** maxFaces: 1 (hanya untuk presensi)
- **Image Cropping:** Resize ke 300x400px sebelum submit
- **Memory Management:** Cleanup tensors dan dispose resources

## Checklist Implementasi

- [x] ✅ Install dependencies
- [x] ✅ Setup TensorFlow backend
- [x] ✅ Load face detection model
- [x] ✅ Detect faces dari video
- [x] ✅ Transform coordinates
- [x] ✅ Validate alignment
- [x] ✅ Draw guide overlay
- [x] ✅ Auto-capture countdown
- [x] ✅ Crop & resize image
- [x] ✅ Integrate dengan UI
- [x] ✅ Handle scan results

## Tips Penggunaan

1. **Testing:** Pastikan WebGL supported di browser
2. **Performance:** Monitor CPU/GPU usage saat detection aktif
3. **Calibration:** Sesuaikan guide dimensions jika perlu
4. **Fallback:** Sistem otomatis fallback ke CPU jika WebGL gagal
5. **Memory:** Clear intervals dan dispose detector saat unmount

## Troubleshooting

### Common Issues:

1. **"TensorFlow initialization failed"**
   - Check browser WebGL support
   - Try incognito mode (disable extensions)

2. **"Face detector not loaded"**
   - Check network connection
   - Verify CDN availability

3. **Poor detection accuracy**
   - Ensure good lighting
   - Check camera quality
   - Adjust guide dimensions

4. **Performance issues**
   - Reduce detection interval
   - Switch to CPU backend
   - Optimize video resolution

## Future Enhancements

- [ ] Multiple face detection untuk group photos
- [ ] Face recognition integration
- [ ] Liveness detection
- [ ] Offline model caching
- [ ] Custom model training