/**
 * Partner form definitions. Server-authoritative (the AI assistant and the
 * portal both consume these; validation is enforced here, not the client).
 * PEP-4 makes these business-admin editable; for now they are static.
 */
export type FieldType = 'text' | 'number' | 'email' | 'select';
export interface FormField {
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    /** Static options; dynamic ones (product/region) resolved by the client. */
    options?: string[];
    /** Dynamic option source the client fills: 'product' | 'region' | 'asset'. */
    optionSource?: 'product' | 'region' | 'asset';
}
export interface FormDef {
    type: string;
    title: string;
    /** Whether submissions always route to human approval (R102). */
    alwaysApprove: boolean;
    fields: FormField[];
}
export declare const FORM_DEFS: FormDef[];
export declare function getFormDef(type: string): FormDef | undefined;
/** Returns the list of missing required field names (R73/R74). */
export declare function missingRequired(def: FormDef, values: Record<string, unknown>): string[];
//# sourceMappingURL=forms.d.ts.map