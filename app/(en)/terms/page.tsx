import { PolicyPage, policyMetadata } from '@/src/components/policy/PolicyPage';
import { termsPolicy } from '@/src/content/policies/terms';

export const metadata = policyMetadata(termsPolicy, 'en');
export default function Page() { return <PolicyPage policy={termsPolicy} locale="en" />; }
