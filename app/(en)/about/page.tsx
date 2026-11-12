import type { Metadata } from 'next';
import { AboutPage, aboutMetadata } from '@/src/routes/about';

export function generateMetadata(): Promise<Metadata> { return aboutMetadata('en'); }
export default function Page() { return AboutPage('en'); }
