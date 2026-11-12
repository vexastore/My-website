import type { Metadata } from 'next';
import { CategoryPage, categoryMetadata, categoryStaticParams, type Props } from '@/src/routes/category';

export const revalidate = 300;
export const generateStaticParams = categoryStaticParams;
export function generateMetadata(props: Props): Promise<Metadata> { return categoryMetadata('en', props); }
export default function Page(props: Props) { return CategoryPage('en', props); }
