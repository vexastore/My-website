import { PolicyPage, policyMetadata } from '@/src/components/policy/PolicyPage';
import { warrantyPolicy } from '@/src/content/policies/warranty';

export const metadata = policyMetadata(warrantyPolicy, 'en');
export default function Page() { return <PolicyPage policy={warrantyPolicy} locale="en" />; }
