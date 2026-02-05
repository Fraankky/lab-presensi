# AGENTS.md

This file contains guidelines for agentic coding assistants working in this repository.

## Build Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Run TypeScript type check (`tsc -b`) and build for production with Vite
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Testing

No testing framework is currently configured. If you add tests, follow these conventions:
- Use Vitest for unit/integration tests (Vite-native)
- Test files should be co-located with source files as `*.test.ts` or `*.test.tsx`
- Component tests in `__tests__` directories when needed

## Code Style Guidelines

### Imports
- Use named imports: `import { useState } from 'react'`
- Type-only imports use `type` keyword: `import type { IconProps } from './Icon'`
- Use `@/` alias for src imports (configured in tsconfig)
- Import React utilities from 'react' package directly
- Group imports: external libraries first, then internal modules

### Formatting & TypeScript
- Strict TypeScript enabled with noUnusedLocals and noUnusedParameters
- Use 2-space indentation
- Single quotes for strings
- Semicolons at end of statements
- Interfaces for object shapes, type aliases for unions/primitives
- Explicit return types for exported functions (optional for internal functions)
- Use `forwardRef` for components that need ref forwarding

### Naming Conventions
- Components: PascalCase (e.g., `CameraFeed`, `FaceScanCard`)
- Functions/variables: camelCase (e.g., `scanFace`, `isScanning`)
- Custom hooks: `use` prefix with PascalCase (e.g., `useFaceDetector`)
- Types/interfaces: PascalCase (e.g., `ScanFaceRequest`, `AlignmentResult`)
- Constants: UPPER_SNAKE_CASE or camelCase depending on scope
- CSS classes: kebab-case for utility classes, camelCase for component-specific classes

### React Components
- Functional components only (no class components)
- Props defined as TypeScript interfaces extending relevant HTML attributes when needed
- Use children prop for composition
- Set displayName for forwarded ref components
- Extract complex logic into custom hooks or utility functions
- Use pattern: `const [state, setState] = useState<Type>(initialValue)`

### Styling (Tailwind CSS v4)
- Use `cn()` utility from `@/lib/utils` for merging Tailwind classes
- Prefer utility classes over custom CSS
- Component variants use class-variance-authority (cva) pattern
- Responsive design: mobile-first with `sm:`, `md:`, `lg:` prefixes
- Semantic color tokens: `bg-zinc-900`, `text-zinc-700`, etc.

### Error Handling
- Always wrap async operations in try-catch blocks
- Throw Error objects with descriptive messages
- Use console.error for logging errors with emoji prefix (e.g., `❌ Error message`)
- Handle fetch errors explicitly (network, timeout, response parsing)
- Provide fallback options where appropriate (e.g., WebGL → CPU backend for TensorFlow)

### React Hooks Usage
- Custom hooks in `src/hooks/` directory
- Use `useRef` for mutable values that persist across renders (detectors, intervals)
- Cleanup effects properly (return cleanup function)
- For fetch/state management, use React Query (@tanstack/react-query)
- Pattern: `const { mutate, data, error, isPending } = useMutation()`

### API Layer
- API functions in `src/api/` directory
- Use async/await for all API calls
- Implement timeout handling with AbortController
- Type requests and responses with interfaces from `src/types/`
- Handle HTTP status codes explicitly
- Use FormData for multipart/form-data uploads

### Types
- Keep types in `src/types/` directory
- Export interfaces for all external data structures
- Use descriptive property names (e.g., `boundingBox` not `bbox`)
- Document complex types with JSDoc comments when needed
- Use optional properties with `?` when appropriate

### Console Logging
- Use emoji prefixes for clarity:
  - ⏳ Loading operations
  - ✅ Success operations
  - ❌ Errors
  - ⚠️ Warnings
- Keep console logs minimal in production code (use conditional logging)

### Comments
- Indonesian comments are acceptable in this codebase (mixed language)
- Keep comments brief and explanatory
- Add comments for complex algorithms or non-obvious logic

## Project Structure

```
src/
├── api/           # API calls and backend integration
├── components/
│   ├── ui/        # shadcn/ui components (Radix primitives)
│   └── scan/      # Feature-specific components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries (cn helper)
├── pages/         # Page-level components
├── types/         # TypeScript type definitions
└── utils/         # Pure utility functions
```

## Technology Stack

- **Framework:** React 19.2 with TypeScript 5.9
- **Build Tool:** Vite 7.2
- **Styling:** Tailwind CSS 4.1
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** React Query (@tanstack/react-query)
- **ML/CV:** TensorFlow.js for face detection
- **Linter:** ESLint with TypeScript, React Hooks, React Refresh plugins

## Before Submitting Code

Always run:
1. `npm run lint` - Ensure no linting errors
2. `npm run build` - Ensure TypeScript compiles without errors
3. Check for TypeScript warnings in the console

## Notes

- The project uses path aliases: `@/*` maps to `src/*`
- shadcn/ui components are configured with "new-york" style, neutral base color, and CSS variables
- Camera and face detection code requires browser permissions (mediaDevices.getUserMedia)
- TensorFlow.js runs in browser; optimize for performance and memory usage
