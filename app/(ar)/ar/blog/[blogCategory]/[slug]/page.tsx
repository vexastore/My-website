import type { Metadata } from 'next';
import { BlogArticlePage, blogArticleMetadata, blogArticleStaticParams, type Props } from '@/src/routes/blogArticle';

export const revalidate = 300;
export const generateStaticParams = blogArticleStaticParams;
export function generateMetadata(props: Props): Promise<Metadata> { return blogArticleMetadata('ar', props); }
export default function Page(props: Props) { return BlogArticlePage('ar', props); }
