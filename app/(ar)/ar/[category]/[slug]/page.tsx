import type { Metadata } from 'next';
import { ProductPage, productMetadata, productStaticParams, type Props } from '@/src/routes/product';

export const revalidate = 300;
export const dynamicParams = true;
export const generateStaticParams = productStaticParams;
export function generateMetadata(props: Props): Promise<Metadata> { return productMetadata('ar', props); }
export default function Page(props: Props) { return ProductPage('ar', props); }
