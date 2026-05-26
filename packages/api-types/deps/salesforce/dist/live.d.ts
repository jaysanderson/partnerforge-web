import type { AccountMatch, CreateAccountInput, CreateOpportunityInput, ListAccountsFilter, SalesforceAdapter, UpdateAccountPatch, UpdateOpportunityPatch } from './adapter.js';
import type { SfAccount, SfAsset, SfContact, SfDescribeField, SfFieldMeta, SfLead, SfObjectName, SfOpportunity, SfPicklistMetadata, SfPriceEntry, SfProduct, SfQuote } from './types.js';
import type { SfEnvironment, SfOAuthProvider, SfOAuthTokens } from './oauth.js';
export interface FieldMap {
    sfField: string;
    pfField: string;
}
export interface LiveSalesforceConfig {
    instanceUrl: string;
    environment: SfEnvironment;
    tokens: SfOAuthTokens;
    fieldMappings: {
        account: FieldMap[];
        contact: FieldMap[];
        opportunity: FieldMap[];
    };
    oauth: SfOAuthProvider;
    /** Persist refreshed tokens (the API writes them back to sf.oauth). */
    onTokenRefresh?: (tokens: SfOAuthTokens) => void;
}
export declare class LiveSalesforceAdapter implements SalesforceAdapter {
    private cfg;
    private accessToken;
    constructor(cfg: LiveSalesforceConfig);
    private req;
    private query;
    private knownFieldsCache;
    /** Lowercased set of field API names that actually exist on the object. */
    private knownFields;
    /**
     * Build a de-duplicated SELECT column list for an object: `Id`, any extra
     * standard columns the caller needs (AccountId, Name, …), plus the mapped
     * SF fields — but only those the org actually has. Dropping unknown fields
     * (e.g. demo-default `Product__c`/`Tier__c` on a vanilla org) keeps SOQL
     * valid instead of throwing INVALID_FIELD, and the de-dupe avoids
     * "duplicate field selected".
     */
    private buildSelect;
    /** True when the object has a field with this API name (describe-backed). */
    private hasField;
    /** Pull a PF field's value out of an SF record using the configured map. */
    private val;
    private str;
    private toAccount;
    private toContact;
    private toOpportunity;
    /** Reverse map: PF patch → SF field/value object for writes. */
    private toSfFields;
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
    getOpportunity(_accountId: string, oppId: string): Promise<SfOpportunity | null>;
    findOpportunityById(oppId: string): Promise<SfOpportunity | null>;
    findAccounts(query: {
        name?: string;
        domain?: string;
    }): Promise<AccountMatch[]>;
    findOpportunitiesByCustomer(query: {
        name?: string;
        domain?: string;
    }): Promise<SfOpportunity[]>;
    describeObject(object: SfObjectName): Promise<SfDescribeField[]>;
    opportunityFields(): Promise<SfFieldMeta[]>;
    picklists(): Promise<SfPicklistMetadata>;
    private create;
    private update;
    createAccount(input: CreateAccountInput): Promise<SfAccount>;
    updateAccount(accountId: string, patch: UpdateAccountPatch): Promise<SfAccount>;
    createOpportunity(input: CreateOpportunityInput): Promise<SfOpportunity>;
    updateOpportunity(oppId: string, patch: UpdateOpportunityPatch): Promise<SfOpportunity>;
    listLeads(): Promise<SfLead[]>;
    listAssets(): Promise<SfAsset[]>;
    listQuotes(): Promise<SfQuote[]>;
    listProducts(): Promise<SfProduct[]>;
    priceBook(): Promise<SfPriceEntry[]>;
    createRenewalFromAsset(): Promise<SfOpportunity>;
}
export declare function getSalesforceLive(cfg: LiveSalesforceConfig): SalesforceAdapter;
//# sourceMappingURL=live.d.ts.map