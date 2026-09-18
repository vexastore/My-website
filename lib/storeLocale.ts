import { cookies } from 'next/headers';
import { STORE_LOCALE_COOKIE, type StoreLocale } from './storeLocaleShared';

export async function getStoreLocale(): Promise<StoreLocale> {
  return (await cookies()).get(STORE_LOCALE_COOKIE)?.value === 'ar' ? 'ar' : 'en';
}
