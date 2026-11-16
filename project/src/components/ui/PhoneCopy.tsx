import type { ReactNode } from 'react';

/** A shorter line on phones, where long copy turns into a wall of text; the full text from 640px. */
const PhoneCopy = ({ phone, children }: { phone: ReactNode; children: ReactNode }) => (
  <>
    <span className="sm:hidden">{phone}</span>
    <span className="max-sm:hidden">{children}</span>
  </>
);

export default PhoneCopy;
