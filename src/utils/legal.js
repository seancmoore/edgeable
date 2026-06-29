// Single source of truth for the legal pages (Terms & Disclaimers, Privacy
// Policy) and the signup consent record.
//
export const LEGAL = {
  businessName: 'Edgeable',
  // Governing law / venue used in the Terms.
  state: 'New York',
  // Public contact address shown on both legal pages.
  contactEmail: 'edgeable_administration@gmail.com',
  // Bump this whenever the Terms or Privacy Policy change in a way that should
  // be re-consented. It is stored on each user doc at signup as a record of
  // exactly which version they accepted.
  version: '1.0',
  // Human-readable "last updated" date shown at the top of each page.
  updated: 'June 13, 2026',
};
