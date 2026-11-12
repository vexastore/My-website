import { PolicyPage, policyMetadata } from '@/src/components/policy/PolicyPage';
import { privacyPolicy } from '@/src/content/policies/privacy';

export const metadata = policyMetadata(privacyPolicy, 'en');
export default function Page() { return <PolicyPage policy={privacyPolicy} locale="en" />; }
