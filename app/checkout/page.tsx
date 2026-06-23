import { Metadata } from 'next';
import { ShopApp } from '@/src/ShopApp';

export const metadata: Metadata = {
  title: 'إتمام الطلب | متجر فيكسا لبنان | Checkout Vexa Store',
  description: 'أكمل طلبك بأمان في متجر فيكسا — دفع عند الاستلام، تغليف سري.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <ShopApp initialCategory="Sex Toys" initialView="checkout" />;
}
