import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArticle } from '../data/blog';
import ArticleView from '../components/content/article/ArticleView';

/** /blog/:slug */
const BlogPost = () => {
  const { slug } = useParams();
  const article = getArticle(slug);

  useEffect(() => {
    if (article) document.title = `${article.title} | Rhulany Tech`;
    return () => {
      document.title = 'Rhulany Tech | Tecnologia original em Maputo';
    };
  }, [article]);

  if (!article) {
    return (
      <div className="container-site py-32 text-center">
        <p className="eyebrow text-ink/45">Blog</p>
        <h1 className="type-display mt-4">Não encontrámos este guia</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">Pode ter mudado de endereço. Veja todos os guias no blog</p>
        <Link to="/blog" className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper">
          Ir para o blog
        </Link>
      </div>
    );
  }

  return <ArticleView key={article.slug} article={article} />;
};

export default BlogPost;
