# Architecture Documentation - Face Detection Attendance System

This document describes the architecture of the frontend face detection attendance (presensi) system. The system captures face images via webcam, validates alignment, and sends them to a backend API for recognition.

> **Note:** This is a frontend-only application. Face recognition is handled by the backend API.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Systems](#core-systems)
  - [Face Detection Pipeline](#face-detection-pipeline)
  - [Canvas Rendering](#canvas-rendering)
  - [Camera Handling](#camera-handling)
  - [Face Alignment Validation](#face-alignment-validation)
  - [Image Processing](#image-processing)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Data Flow](#data-flow)
- [Configuration](#configuration)

---

## Technology Stack

### Core Framework
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool |

### Face Detection & ML
| Package | Version | Purpose |
|---------|---------|---------|
| @tensorflow-models/face-detection | 1.0.3 | MediaPipe face detector |
| @tensorflow/tfjs-core | 4.22.0 | ML computation engine |
| @tensorflow/tfjs-backend-webgl | 4.22.0 | GPU acceleration |
| @tensorflow/tfjs-converter | 4.22.0 | Model conversion |

### State Management & Data Fetching
| Package | Version | Purpose |
|---------|---------|---------|
| @tanstack/react-query | 5.90.15 | Server state management |

### UI & Styling
| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | 4.1.18 | Utility-first CSS |
| @radix-ui/* | various | Accessible UI primitives |
| class-variance-authority | 0.7.1 | Component variants |

---

## Project Structure

```
src/
├── api/
│   └── faceScan.ts              # Face scan API integration
├── components/
│   ├── scan/                    # Face scanning components
│   │   ├── CameraFeed.tsx       # Core camera & face detection
│   │   ├── FaceScanCard.tsx     # Main scan card component
│   │   ├── AttendanceListCard.tsx # Attendance list display
│   │   ├── ScanOverlays.tsx     # Visual feedback overlays
│   │   ├── LoadingOverlay.tsx   # Loading state UI
│   │   ├── ViewInitial.tsx      # Initial view state
│   │   ├── ViewSuccess.tsx      # Success view
│   │   ├── ViewError.tsx        # Error view
│   │   ├── FooterBar.tsx        # Footer status
│   │   └── index.ts             # Barrel export
│   └── ui/                      # Reusable UI components (shadcn/ui)
│       ├── Button.tsx
│       ├── Icon.tsx
│       ├── card.tsx
│       └── ...
├── hooks/
│   ├── useFaceDetector.ts       # Face detection hook
│   └── useFaceScan.ts           # Face scan API hook
├── utils/
│   ├── tfSetup.ts               # TensorFlow initialization
│   ├── camera.ts                # Camera utilities
│   ├── canvasDrawing.ts         # Canvas rendering
│   ├── parseFaceDetection.ts    # Parse detection results
│   ├── faceAlignment.ts         # Face alignment validation
│   ├── imageCropping.ts         # Image crop & resize
│   └── coordinateTransform.ts   # Coordinate scaling
├── types/
│   ├── faceDetection.types.ts   # Face detection types
│   └── scan.types.ts            # Scan API types
├── lib/
│   └── utils.ts                 # Utility functions (cn)
├── pages/
│   └── App.tsx                  # Main app component
├── main.tsx                     # React entry point
└── index.css                    # Global styles
```

---

## Core Systems

### Face Detection Pipeline

**Location:** `src/hooks/useFaceDetector.ts`

The face detection uses TensorFlow.js with the MediaPipe face detector model.

```
useFaceDetector Hook
  ├── loadModel()
  │   └── Creates MediaPipeModel with TensorFlow runtime
  │       └── Max 1 face detection
  └── detectFaces(input)
      ├── Validates video/canvas input
      ├── Calls estimateFaces() on MediaPipe detector
      ├── Filters valid faces (box dimensions > 0)
      └── Returns Face[] with bounding box & keypoints
```

**Key Configuration:**
- **Model:** MediaPipeFaceDetector
- **Runtime:** TFJS
- **Max Faces:** 1
- **Input:** HTMLVideoElement or HTMLCanvasElement

**Output Structure:**
```typescript
interface FaceDetectionResult {
  boundingBox: { xMin, yMin, xMax, yMax, width, height }
  keypoints: Array<{ x, y, name? }>  // eyes, nose, etc.
  score?: number                      // confidence
}
```

### Canvas Rendering

**Location:** `src/utils/canvasDrawing.ts`

The system uses a **two-canvas architecture** in CameraFeed:

1. **Video Canvas** - Displays the video stream and serves as input for face detection
2. **Overlay Canvas** - Renders the guide oval and bounding boxes on top

**Drawing Functions:**

| Function | Purpose |
|----------|---------|
| `drawGuideOverlay(canvas, guide, color)` | Draws oval guide with dashed line style |
| `drawFaceBoundingBox(canvas, face)` | Green bounding box + red keypoint circles |

**Guide Colors:**
- 🔴 Red - No face detected or poor alignment
- 🟡 Yellow - Face detected, alignment score > 50%
- 🟢 Green - Face aligned, ready for capture

### Camera Handling

**Location:** `src/utils/camera.ts`

```typescript
initializeCamera(): MediaStream
  ├── Requests user media
  ├── Preferred resolution: 1280x720
  ├── Front-facing camera (facingMode: 'user')
  └── Returns MediaStream

stopCamera(stream: MediaStream)
  └── Stops all video tracks
```

**CameraFeed Component Lifecycle:**

1. **Setup Phase** - Gets MediaStream, assigns to `<video>`, waits for 'loadeddata' event
2. **Detection Loop** - Runs every 100ms via `setInterval`
   - Draws video frame to canvas
   - Passes canvas to `detectFaces()`
   - Validates alignment
   - Triggers countdown when aligned
3. **Countdown Capture** - 3-second countdown, then captures and crops face image

### Face Alignment Validation

**Location:** `src/utils/faceAlignment.ts`

The `validateAlignment()` function performs 4 checks:

| Check | Description | Tolerance |
|-------|-------------|-----------|
| `inGuide` | Face center within guide bounds | ±10% |
| `rightSize` | Face height relative to guide | 60-80% |
| `centered` | Horizontal centering | ±10% canvas width |
| `eyesHorizontal` | Head tilt (eye angle) | < 15° |

**Scoring:**
```
score = (passedChecks / 4) * 100
isAligned = passedChecks >= 2
```

**Feedback Messages (Indonesian):**
- "Sempurna! 😊" - All checks pass
- "Posisikan wajah di dalam kotak" - Face outside guide
- "Dekatkan wajah" / "Jauhkan wajah" - Wrong size
- "Geser ke kanan" / "Geser ke kiri" - Misaligned horizontally
- "Luruskan kepala" - Head tilted

### Image Processing

**Location:** `src/utils/imageCropping.ts`

```
cropAndResizeFace(video, guide) → Blob
  ├── Step 1: Create temp canvas (guide dimensions)
  │   └── Crop area from video using guide coordinates
  ├── Step 2: Create resize canvas (300 x 400 px)
  │   └── Scale cropped image
  └── Step 3: Convert to JPEG Blob (quality: 0.95)
```

**Coordinate Transform** (`src/utils/coordinateTransform.ts`):
Transforms face coordinates from video space to canvas display space, handling different aspect ratios.

---

## Component Architecture

### Component Hierarchy

```
App
└── FaceScanCard (main component)
    ├── Header (title + subtitle)
    ├── Card (container)
    │   ├── Camera Preview Section
    │   │   ├── CameraFeed (video + overlay canvas)
    │   │   ├── ScanOverlays (corner brackets + status)
    │   │   └── LoadingOverlay (spinner + backdrop)
    │   └── Content Area (state-dependent)
    │       ├── ViewInitial (status + feedback)
    │       ├── ViewSuccess (confirmation + user info)
    │       └── ViewError (error message + retry)
    └── FooterBar (online status + version)

AttendanceListCard (separate card)
├── Header (title + class info)
├── ScrollArea (scrollable student list)
└── Footer (total count + last update)
```

### Key Component Props

**CameraFeed:**
```typescript
interface CameraFeedProps {
  onCameraReady?: (video, canvas) => void
  onCameraError?: (error: string) => void
  onFaceCaptured?: (image: Blob) => void
  onAlignmentUpdate?: (result: AlignmentResult) => void
}
```

---

## State Management

### React Query Setup

```typescript
// main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 }
  }
})
```

### Component-Level State

**CameraFeed.tsx:**
| State | Purpose |
|-------|---------|
| `isLoading` | Camera initialization |
| `hasError` | Camera access error |
| `isTfReady` | TensorFlow loaded |
| `isVideoReady` | Video stream ready |
| `countdown` | Capture countdown timer |

**FaceScanCard.tsx:**
| State | Purpose |
|-------|---------|
| `scanState` | 'initial' \| 'loading' \| 'success' \| 'error' |
| `alignmentFeedback` | Real-time alignment feedback text |

### useFaceScan Hook

```typescript
const mutation = useMutation<ScanFaceResponse, Error, ScanFaceRequest>({
  mutationFn: scanFaceAPI,
  onSuccess: (data) => { ... },
  onError: (error) => { ... }
})

// Returns
{
  scanFace,      // trigger mutation
  scanFaceAsync, // await mutation
  isScanning,    // isPending state
  scanResult,    // response data
  scanError,     // error object
  reset          // clear state
}
```

---

## API Integration

**Location:** `src/api/faceScan.ts`

### Endpoint

```
POST ${VITE_API_BASE_URL}/api/scan-face
Content-Type: multipart/form-data
Timeout: 5000ms
```

### Request/Response

```typescript
// Request
interface ScanFaceRequest {
  image: Blob  // JPEG face image (300x400)
}

// Response
interface ScanFaceResponse {
  match: boolean
  confidence?: number
  user?: {
    nim: string
    nama: string
  }
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         CameraFeed                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Camera Stream → Video Element                    │   │
│  │  2. Video Frame → Canvas (100ms interval)            │   │
│  │  3. Canvas → TensorFlow Face Detection               │   │
│  │  4. Detection Result → Alignment Validation          │   │
│  │  5. Aligned? → Start 3s Countdown                    │   │
│  │  6. Countdown Complete → Crop & Resize Face          │   │
│  │  7. Emit Blob via onFaceCaptured()                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       FaceScanCard                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  8. Receive Blob → Set loading state                 │   │
│  │  9. Call useFaceScan.scanFace({ image: blob })       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      useFaceScan Hook                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  10. POST /api/scan-face (FormData with image)       │   │
│  │  11. Wait for response (5s timeout)                  │   │
│  │  12. Return { match, confidence?, user? }            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   UI State Update                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  13. Success → ViewSuccess (show user info)          │   │
│  │      Error → ViewError (show error message)          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### UX State Machine

```
[Initial] → Camera initializing, TensorFlow loading
    ↓
[Ready] → Video playing, detection active, red guide
    ↓
[Detecting] → Face detected, yellow guide, feedback shown
    ↓
[Aligned] → All checks pass, green guide, 3s countdown
    ↓
[Capturing] → Crop face, convert to JPEG
    ↓
[Loading] → Show spinner, send to API
    ↓
[Success/Error] → Display result, reset available
```

---

## Configuration

### Environment Variables

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=5000
VITE_DEBUG=false
```

### TensorFlow Setup

**Location:** `src/utils/tfSetup.ts`

```typescript
initializeTensorFlow(): Promise<boolean>
  ├── Primary: WebGL backend (GPU acceleration)
  └── Fallback: CPU backend
```

### Vite Configuration

```typescript
// vite.config.ts
plugins: [react(), tailwindcss()]
resolve.alias: { "@": "/absolute/path/to/src" }
```

---

## Browser Requirements

- Modern browser with WebGL support
- MediaStream API (camera access)
- Canvas API
- IndexedDB (TensorFlow model caching)

## Performance Notes

- Face detection runs every **100ms** (10 FPS)
- WebGL backend preferred for GPU acceleration
- Captured images resized to **300x400** pixels for API efficiency
- Single face detection only (max 1 face)
