import toast from 'react-hot-toast';
import type { Article } from '../../../data/blog';

/** Share the guide on WhatsApp or copy its link. */

const ShareLinks = ({ article }: { article: Article }) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('Link copiado');
    } catch {
      toast('Não foi possível copiar o link');
    }
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={copy}
        className="h-9 rounded-full bg-white px-4 text-ink/70 transition-colors hover:text-ink"
      >
        Copiar link
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${window.location.href}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 items-center rounded-full bg-white px-4 text-ink/70 transition-colors hover:text-ink"
      >
        Partilhar no WhatsApp
      </a>
    </div>
  );
};

export default ShareLinks;
