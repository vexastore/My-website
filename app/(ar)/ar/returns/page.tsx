import { PolicyPage, policyMetadata } from '@/src/components/policy/PolicyPage';
import { returnsPolicy } from '@/src/content/policies/returns';

export const metadata = policyMetadata(returnsPolicy, 'ar');
export default function Page() { return <PolicyPage policy={returnsPolicy} locale="ar" />; }
