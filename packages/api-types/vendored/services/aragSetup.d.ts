/**
 * Initialise the labelset taxonomy in every Knowledge Box. Idempotent —
 * ARAG's POST /labelset/{id} is an upsert. Entity groups are not
 * pre-created (this Progress deployment doesn't expose entity-group
 * management endpoints); they materialise from NER/relations on every
 * resource upload during ingestion.
 */
import { type KbName } from '@partnerforge/arag-client';
export interface AragSetupReport {
    kbs: {
        name: KbName;
        uuid: string;
        title: string;
        labelsets: number;
    }[];
}
export declare function setupLabelsets(): Promise<AragSetupReport>;
