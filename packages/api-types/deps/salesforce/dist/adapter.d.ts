import type { SfAccount, SfAsset, SfContact, SfFieldMeta, SfLead, SfOpportunity, SfPicklistMetadata, SfPriceEntry, SfProduct, SfQuote } from './types.js';
export interface CreateOpportunityInput {
    accountId: string;
    name: string;
    customerName: string;
    customerDomain?: string;
    amount: number;
    product: string;
    contactName?: string;
}
export interface CreateAccountInput {
    name: string;
    domain: string;
    type: SfAccount['type'];
    region: SfAccount['region'];
}
/**
 * Optional filters for `listAccounts`. All are AND-combined server-side. Used
 * by the cache layer when the API wants a filtered list (e.g. by tier on the
 * Partners page). Field names mirror the SfAccount shape.
 */
export interface ListAccountsFilter {
    tier?: SfAccount['tier'];
    type?: SfAccount['type'];
    region?: SfAccount['region'];
}
/** Patchable subset of SfAccount fields (Salesforce ignores immutable ones). */
export type UpdateAccountPatch = Partial<Pick<SfAccount, 'name' | 'domain' | 'tier' | 'type' | 'region' | 'languages' | 'productCoverage' | 'isDistributor'>>;
/** Patchable subset of SfOpportunity fields. */
export type UpdateOpportunityPatch = Partial<Pick<SfOpportunity, 'name' | 'customerName' | 'customerDomain' | 'amount' | 'currency' | 'stage' | 'status' | 'closeDate' | 'product' | 'contactName' | 'ownerName'>>;
export interface AccountMatch {
    account: SfAccount;
    reason: 'exact_name' | 'similar_name' | 'domain';
}
export interface SalesforceAdapter {
    getAccount(accountId: string): Promise<SfAccount | null>;
    /**
     * Enumerate all accounts the caller can see (internal staff = all; partner
     * principals never call this — they use getAccount on their own id). Used
     * by the cache layer to populate the `partners.list` cache.
     */
    listAccounts(filter?: ListAccountsFilter): Promise<SfAccount[]>;
    /** Cross-account contact lookup by SF Contact Id (used by cache refresh). */
    getContact(contactId: string): Promise<SfContact | null>;
    listContacts(accountId: string): Promise<SfContact[]>;
    contactByEmail(email: string): Promise<SfContact | null>;
    listOpportunities(accountId: string, filter?: {
        status?: SfOpportunity['status'];
    }): Promise<SfOpportunity[]>;
    /**
     * List opportunities across all accounts (internal staff only). Used by the
     * cache layer to populate the `deals.list` cache.
     */
    listAllOpportunities(filter?: {
        status?: SfOpportunity['status'];
    }): Promise<SfOpportunity[]>;
    getOpportunity(accountId: string, oppId: string): Promise<SfOpportunity | null>;
    listLeads(accountId: string): Promise<SfLead[]>;
    listAssets(accountId: string): Promise<SfAsset[]>;
    listQuotes(accountId: string): Promise<SfQuote[]>;
    listProducts(forTier?: SfAccount['tier']): Promise<SfProduct[]>;
    priceBook(tier: SfAccount['tier']): Promise<SfPriceEntry[]>;
    picklists(): Promise<SfPicklistMetadata>;
    opportunityFields(): Promise<SfFieldMeta[]>;
    /** Cross-account dedupe input for account-creation governance (R98–R101). */
    findAccounts(query: {
        name?: string;
        domain?: string;
    }): Promise<AccountMatch[]>;
    /** Cross-account opportunity lookup for channel-conflict detection (R109). */
    findOpportunitiesByCustomer(query: {
        name?: string;
        domain?: string;
    }): Promise<SfOpportunity[]>;
    /** Cross-account opportunity lookup (internal use, e.g. collaboration). */
    findOpportunityById(oppId: string): Promise<SfOpportunity | null>;
    createOpportunity(input: CreateOpportunityInput): Promise<SfOpportunity>;
    /** Partial update; returns the freshly mutated record (cache writes from this). */
    updateOpportunity(oppId: string, patch: UpdateOpportunityPatch): Promise<SfOpportunity>;
    createAccount(input: CreateAccountInput): Promise<SfAccount>;
    updateAccount(accountId: string, patch: UpdateAccountPatch): Promise<SfAccount>;
    createRenewalFromAsset(accountId: string, assetId: string): Promise<SfOpportunity>;
}
/** In-memory mock. Mutations persist for the process lifetime only. */
export declare class MockSalesforceAdapter implements SalesforceAdapter {
    private accounts;
    private opportunities;
    getAccount(accountId: string): Promise<SfAccount | null>;
    listAccounts(filter?: ListAccountsFilter): Promise<SfAccount[]>;
    getContact(contactId: string): Promise<SfContact | null>;
    listContacts(accountId: string): Promise<SfContact[]>;
    contactByEmail(email: string): Promise<SfContact | null>;
    listOpportunities(accountId: string, filter?: {
        status?: SfOpportunity['status'];
    }): Promise<SfOpportunity[]>;
    listAllOpportunities(filter?: {
        status?: SfOpportunity['status'];
    }): Promise<SfOpportunity[]>;
    getOpportunity(accountId: string, oppId: string): Promise<SfOpportunity | null>;
    listLeads(accountId: string): Promise<SfLead[]>;
    listAssets(accountId: string): Promise<SfAsset[]>;
    listQuotes(accountId: string): Promise<SfQuote[]>;
    listProducts(forTier?: SfAccount['tier']): Promise<SfProduct[]>;
    priceBook(tier: SfAccount['tier']): Promise<SfPriceEntry[]>;
    picklists(): Promise<SfPicklistMetadata>;
    opportunityFields(): Promise<SfFieldMeta[]>;
    findAccounts(query: {
        name?: string;
        domain?: string;
    }): Promise<AccountMatch[]>;
    findOpportunitiesByCustomer(query: {
        name?: string;
        domain?: string;
    }): Promise<SfOpportunity[]>;
    findOpportunityById(oppId: string): Promise<SfOpportunity | null>;
    createOpportunity(input: CreateOpportunityInput): Promise<SfOpportunity>;
    createAccount(input: CreateAccountInput): Promise<SfAccount>;
    updateAccount(accountId: string, patch: UpdateAccountPatch): Promise<SfAccount>;
    updateOpportunity(oppId: string, patch: UpdateOpportunityPatch): Promise<SfOpportunity>;
    createRenewalFromAsset(accountId: string, assetId: string): Promise<SfOpportunity>;
}
//# sourceMappingURL=adapter.d.ts.map