import type { Metadata } from 'next';
import { AdultToysPage, adultToysMetadata } from '@/src/routes/adultToys';

export const revalidate = 300;
export function generateMetadata(): Promise<Metadata> { return adultToysMetadata('en'); }
export default function Page() { return AdultToysPage('en'); }
