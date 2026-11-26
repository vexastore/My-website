/**
 * The store's own public profiles, in the order they should appear.
 *
 * Used for the OnlineStore `sameAs` in the site-wide JSON-LD (src/layouts/RootDocument.tsx),
 * which tells Google these pages are the same business as vexatoys.com. Only profiles the
 * store controls and that are live belong here; directories (Brownbook, Yelleb) are
 * citations, not identity pages, and stay out. Keep the list in step with
 * docs/backlinks-strategy.md ("Status" table).
 *
 * Not listed on purpose (26 Nov 2026): the LinkedIn entry is a personal profile named
 * "Vexa Store", not a company page; Flickr has no website on it. Add them once fixed.
 */
export interface SocialProfile {
  /** Short network name, for labels. */
  name: string;
  /** Canonical public URL of the profile. */
  url: string;
}

export const SOCIAL_PROFILES: readonly SocialProfile[] = [
  { name: 'Facebook', url: 'https://www.facebook.com/people/Vexa-Toys/pfbid037dy56Pzn9L1h4pbq5McM1hKuAiekzSwdzrTwGq2nZFkW3RA2J4QwEUr3SUqUtcNJl/' },
  { name: 'Instagram', url: 'https://www.instagram.com/sex_toys_leb/' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@vexa.toys' },
  { name: 'Pinterest', url: 'https://www.pinterest.com/vexastore72/' },
  { name: 'about.me', url: 'https://about.me/vexatoys' },
];

/** The URLs alone, for schema.org `sameAs`. */
export const SOCIAL_PROFILE_URLS: readonly string[] = SOCIAL_PROFILES.map(profile => profile.url);
