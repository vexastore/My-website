import '../globals.css';
import { RootDocument, rootMetadata } from '@/src/layouts/RootDocument';

// Root layout of the Arabic routes (`/ar`, `/ar/vibrators`, ...): the same
// document as the English one with `lang="ar" dir="rtl"` set on the server.
export const metadata = rootMetadata('ar');

export default function ArabicRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="ar">{children}</RootDocument>;
}
