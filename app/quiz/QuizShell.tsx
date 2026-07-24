'use client';

/**
 * QuizShell — thin client-side wrapper around QuizClient.
 *
 * This file exists so quiz/page.tsx (a Server Component) can import a
 * 'use client' boundary without any dynamic-import complexity.
 * React renders this component only on the client, so no server-side
 * evaluation of QuizClient ever happens, preventing build-time failures.
 */
import { QuizClient } from './QuizClient';

export default function QuizShell() {
  return <QuizClient />;
}
