import { lazy, Suspense, type ComponentProps } from 'react';

// three.js is heavy: load the 3D phone in its own chunk so it never delays the first paint.
const RealisticPhone = lazy(() => import('./RealisticPhone'));

const LazyRealisticPhone = (props: ComponentProps<typeof RealisticPhone>) => (
  <Suspense fallback={<div className="h-[calc(var(--phone-w)*2.1)] w-[var(--phone-w)]" />}>
    <RealisticPhone {...props} />
  </Suspense>
);

export default LazyRealisticPhone;
