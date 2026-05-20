/**
 * Mock Salesforce dataset. Account ids deliberately equal the seeded
 * PartnerForge partner ids (prt_northwind/prt_lumina/prt_apex) so portal
 * principal.partnerId scopes straight onto SF accounts with no mapping table
 * for the MVP. The real connector replaces this module wholesale.
 */
import type { SfAccount, SfAsset, SfContact, SfFieldMeta, SfLead, SfOpportunity, SfPriceEntry, SfPicklistMetadata, SfProduct, SfQuote } from './types.js';
export declare const ACCOUNTS: SfAccount[];
export declare const CONTACTS: SfContact[];
export declare const OPPORTUNITIES: SfOpportunity[];
export declare const LEADS: SfLead[];
export declare const ASSETS: SfAsset[];
export declare const QUOTES: SfQuote[];
export declare const PRODUCTS: SfProduct[];
export declare const PRICEBOOK: SfPriceEntry[];
export declare const PICKLISTS: SfPicklistMetadata;
/** Field metadata — drives partner-facing labels + visibility (R28/R29). */
export declare const OPPORTUNITY_FIELDS: SfFieldMeta[];
