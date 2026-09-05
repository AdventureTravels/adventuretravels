import { ArticleCard } from "./ArticleCard";
import type { ArticleWithCategory } from "@/lib/content/articles";
import styles from "@/app/journal/page.module.css";

export function articleLabel(article: ArticleWithCategory): string {
  return [article.category?.name, article.tag].filter(Boolean).join(" · ");
}

export function JournalGrid({ articles }: { articles: ArticleWithCategory[] }) {
  if (articles.length === 0) return null;
  return (
    <div className={styles.grid}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          href={`/journal/${article.slug}`}
          image={article.heroImage}
          tag={articleLabel(article)}
          title={article.title}
          text={article.excerpt}
        />
      ))}
    </div>
  );
}
