import { Component, lazy, Suspense, type ComponentProps, type ReactNode } from 'react';
import { supportsWebGL } from '../../../lib/webgl';

// three.js is heavy: load the 3D phone in its own chunk so it never delays the first paint.
const PhoneScene = lazy(() => import('./PhoneScene').then((module) => ({ default: module.PhoneScene })));

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Fill-mode 3D phone for the product gallery; shows `fallback` (a photo) without WebGL or if the scene fails. */
const LazyPhoneScene = ({ fallback, ...props }: ComponentProps<typeof PhoneScene> & { fallback: ReactNode }) => {
  if (!supportsWebGL()) return <>{fallback}</>;
  return (
    <SceneBoundary fallback={fallback}>
      <Suspense fallback={null}>
        <PhoneScene {...props} />
      </Suspense>
    </SceneBoundary>
  );
};

export default LazyPhoneScene;
