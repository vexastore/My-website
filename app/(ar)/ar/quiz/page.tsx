import type { Metadata } from 'next';
import { QuizPage, quizMetadata } from '@/src/routes/quiz';

export function generateMetadata(): Promise<Metadata> { return quizMetadata('ar'); }
export default function Page() { return QuizPage('ar'); }
