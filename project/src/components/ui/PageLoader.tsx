import { useEffect } from 'react';
import { settleBootLoader } from '../../lib/bootLoader';
import TechChip from './TechChip';

/**
 * Shown while a page's code loads. Same chip and wordmark as the first-visit loader in index.html,
 * and like it, it only fades in when loading takes a moment.
 */
const PageLoader = () => {
  // When the first page arrives, the full-screen loader can go.
  useEffect(() => () => settleBootLoader(), []);

  return (
    <div data-page-loader className="grid min-h-[80svh] place-items-center" role="status" aria-label="A carregar a página">
      <div className="rt-loader">
        <TechChip />
        <p className="rt-wordmark">
          Rhulany<span>Tech</span>
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
