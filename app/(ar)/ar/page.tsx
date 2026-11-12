import type { Metadata } from 'next';
import { HomePage, homeMetadata } from '@/src/routes/home';

export const revalidate = 300;
export function generateMetadata(): Promise<Metadata> { return homeMetadata('ar'); }
export default function Page() { return HomePage('ar'); }
