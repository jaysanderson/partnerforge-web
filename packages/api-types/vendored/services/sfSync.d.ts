/**
 * Salesforce → local-cache merge layer for the "shared CRM entities"
 * (Account → partners, Contact → partner_contacts, Opportunity → deals).
 *
 * The local DB tables play two roles depending on `AppMode`:
 *   - **demo**: the seeded rows ARE the source of truth. Mock SF adapter
 *     happens to mirror them by id; we never refresh, so the seed wins.
 *   - **live**: the rows are a cache. We refresh from SF when stale.
 *
 * Merge rules
 *   • SF-canonical fields (name, domain, tier, type, region, etc.) are
 *     overwritten by the SF response on every refresh.
 *   • PartnerForge-only fields (status, engagementScore, churnRiskScore,
 *     ownerUserId, primaryContact*, logoUrl, …) are PRESERVED from the
 *     existing cache row, or defaulted on first insert.
 *   • `partners.id` IS the SF Account Id — there is no separate uuid. The
 *     seed has always used SF-style ids (`prt_northwind` etc.) so existing
 *     foreign keys remain valid after the flip.
 *   • `crmId` stays in sync with `id` for legacy / dual-system observability.
 */
import { schema, type DbConnection } from '@partnerforge/db';
import type { SalesforceAdapter, SfAccount, SfContact, SfOpportunity, ListAccountsFilter } from '@partnerforge/salesforce';
import type { Logger } from '../logger.js';
type PartnerRow = typeof schema.partners.$inferSelect;
type ContactRow = typeof schema.partnerContacts.$inferSelect;
type DealRow = typeof schema.deals.$inferSelect;
/** Build a partners row from an SfAccount, preserving PF-only fields. */
export declare function mergePartnerFromSf(existing: PartnerRow | undefined, sf: SfAccount): PartnerRow;
/** Build a partner_contacts row from an SfContact, preserving PF-only fields. */
export declare function mergeContactFromSf(existing: ContactRow | undefined, sf: SfContact): ContactRow;
/** Upsert one partner cache row from an SfAccount. */
export declare function upsertPartnerFromSf(db: DbConnection, sf: SfAccount): void;
/** Upsert one partner_contacts cache row from an SfContact. */
export declare function upsertContactFromSf(db: DbConnection, sf: SfContact): void;
/**
 * Build a deals row from an SfOpportunity, preserving PF-only fields
 * (healthScore, industry, region, contactEmail, metadata, registeredAt,
 * deletedAt). `deals.id` IS the SF Opportunity Id, matching the convention
 * established for partners.id.
 */
export declare function mergeDealFromSf(existing: DealRow | undefined, sf: SfOpportunity): DealRow;
/** Upsert one deals cache row from an SfOpportunity. */
export declare function upsertDealFromSf(db: DbConnection, sf: SfOpportunity): void;
/**
 * Refresh the deals cache from SF if any row is stale (or empty). Uses
 * `listAllOpportunities` — the cross-account list method added in PR_SF1.
 * Graceful: SF outages log warn and serve whatever cache exists.
 */
export declare function refreshDealsIfStale(db: DbConnection, sf: SalesforceAdapter, log: Logger): Promise<void>;
/** Refresh one deal row if stale. Looks up across accounts (internal use). */
export declare function refreshDealIfStale(db: DbConnection, sf: SalesforceAdapter, log: Logger, dealId: string): Promise<void>;
/**
 * Refresh the partners cache from SF if any row is stale (or rows are
 * missing — empty cache always qualifies). Never throws: SF outages are
 * logged and the caller serves whatever cache exists.
 */
export declare function refreshPartnersIfStale(db: DbConnection, sf: SalesforceAdapter, log: Logger, filter?: ListAccountsFilter): Promise<void>;
/** Refresh a single partner row if stale. Same swallow-and-log semantics. */
export declare function refreshPartnerIfStale(db: DbConnection, sf: SalesforceAdapter, log: Logger, partnerId: string): Promise<void>;
/**
 * Refresh contacts for one partner. Lighter-weight: only touched on
 * getDetailed (so we don't flood SF on every list).
 */
export declare function refreshContactsForPartnerIfStale(db: DbConnection, sf: SalesforceAdapter, log: Logger, partnerId: string): Promise<void>;
export {};
