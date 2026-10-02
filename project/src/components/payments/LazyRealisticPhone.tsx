import { Component, lazy, Suspense, type ComponentProps, type ReactNode } from 'react';
import { products } from '../../data/products';
import { supportsWebGL } from '../../lib/webgl';

// three.js is heavy: load the 3D phone in its own chunk so it never delays the first paint.
const RealisticPhone = lazy(() => import('./RealisticPhone'));

const showcase = products.find((product) => product.id === '1');

const box = 'h-[calc(var(--phone-w)*2.1)] w-[var(--phone-w)]';

// Shown when WebGL is unavailable or the 3D scene fails: the product photo, so the page never breaks.
const PhonePhoto = () => (
  <div className={`${box} overflow-hidden rounded-[calc(var(--phone-w)*0.18)] bg-mist`}>
    {showcase && <img src={showcase.images[0]} alt="" className="h-full w-full object-cover" />}
  </div>
);

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <PhonePhoto /> : this.props.children;
  }
}

const LazyRealisticPhone = (props: ComponentProps<typeof RealisticPhone>) => {
  if (!supportsWebGL()) return <PhonePhoto />;

  return (
    <SceneBoundary>
      <Suspense fallback={<div className={box} />}>
        <RealisticPhone {...props} />
      </Suspense>
    </SceneBoundary>
  );
};

export default LazyRealisticPhone;
