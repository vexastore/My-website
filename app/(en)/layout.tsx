import '../globals.css';
import { RootDocument, rootMetadata } from '@/src/layouts/RootDocument';

// Root layout of the English routes (`/`, `/vibrators`, ...). Arabic routes
// have their own root layout under app/(ar) so `<html lang dir>` comes from the URL.
export const metadata = rootMetadata('en');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
