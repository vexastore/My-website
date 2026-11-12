import { PolicyPage, policyMetadata } from '@/src/components/policy/PolicyPage';
import { deliveryPolicy } from '@/src/content/policies/delivery';

export const metadata = policyMetadata(deliveryPolicy, 'en');
export default function Page() { return <PolicyPage policy={deliveryPolicy} locale="en" />; }
