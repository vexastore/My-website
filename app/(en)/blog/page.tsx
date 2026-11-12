import type { Metadata } from 'next';
import { BlogIndexPage, blogIndexMetadata } from '@/src/routes/blogIndex';

export const revalidate = 300;
export function generateMetadata(): Promise<Metadata> { return blogIndexMetadata('en'); }
export default function Page() { return BlogIndexPage('en'); }
