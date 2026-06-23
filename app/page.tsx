import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'متجر فيكسا | رقم 1 في لبنان للألعاب الزوجية واللانجري | Vexa Store Lebanon',
  description: 'متجر فيكسا – أفضل متجر لشراء ألعاب زوجية، هزازات، ولانجري في لبنان. توصيل سري في نفس اليوم في بيروت. دفع عند الاستلام.',
  alternates: { canonical: 'https://vexatoys.com' },
};

export default function HomePage() {
  redirect('/sex-toys');
}
