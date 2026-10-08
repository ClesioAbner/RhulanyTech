import type { ReactNode } from 'react';

/** iPhone Air from the front: polished titanium edge, a slim black border, the screen inside. */
const AirFront = ({ children }: { children: ReactNode }) => (
  <div
    className="relative h-full w-full p-[1.4cqw]"
    style={{
      borderRadius: '11cqw',
      background:
        'linear-gradient(90deg, #7d8087 0%, #e4e6ea 6%, #c4c7cd 22%, #eef0f2 50%, #c4c7cd 78%, #e9ebee 94%, #7b7e85 100%)',
    }}
  >
    <div
      className="h-full w-full bg-black p-[2.1cqw] shadow-[inset_0_0_0_0.25cqw_rgba(255,255,255,0.07)]"
      style={{ borderRadius: '9.6cqw' }}
    >
      <div className="relative h-full w-full overflow-hidden [container-type:inline-size]" style={{ borderRadius: '7.6cqw' }}>
        {children}
        {/* Glass: a faint reflection across the top corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_32%)]"
        />
      </div>
    </div>
  </div>
);

export default AirFront;
