import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';

export const metadata: Metadata = {
  title: 'Admin Panel — Vexa Store',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <ShopApp initialCategory="Sex Toys" initialView="admin" />;
}
