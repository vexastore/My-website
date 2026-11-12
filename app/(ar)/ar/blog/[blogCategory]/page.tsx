import type { Metadata } from 'next';
import { BlogCategoryPage, blogCategoryMetadata, blogCategoryStaticParams, type Props } from '@/src/routes/blogCategory';

export const revalidate = 300;
export const generateStaticParams = blogCategoryStaticParams;
export function generateMetadata(props: Props): Promise<Metadata> { return blogCategoryMetadata('ar', props); }
export default function Page(props: Props) { return BlogCategoryPage('ar', props); }
