import { useEffect } from 'react';
import { settleBootLoader } from '../../lib/bootLoader';
import BrandLoader from './BrandLoader';

/**
 * Shown while a page's code loads: the logo, like the first-visit loader in index.html, and like it,
 * it only fades in when loading takes a moment.
 */
const PageLoader = () => {
  // When the first page arrives, the full-screen loader can go.
  useEffect(() => () => settleBootLoader(), []);

  return (
    <div data-page-loader className="grid min-h-[80svh] place-items-center" role="status" aria-label="A carregar a página">
      <BrandLoader size={24} progress />
    </div>
  );
};

export default PageLoader;
