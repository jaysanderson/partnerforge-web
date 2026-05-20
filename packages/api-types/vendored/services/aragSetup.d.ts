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
/**
 * Provision the video KB — installs TubeRAG-specific labelsets (topic /
 * lang / channel / safety) AND the 8 Data Augmentation agents from the
 * TubeRAG recipe. Idempotent: re-runs are safe, the server upserts.
 *
 * Returns the number of labelsets + tasks installed. Throws clearly if
 * `ARAG_VIDEO_KB_ID` isn't set (i.e. the KB hasn't been provisioned
 * out-of-band in the PARAG dashboard yet).
 */
export declare function setupVideoKb(): Promise<{
    uuid: string;
    title: string;
    labelsets: number;
    daTasks: number;
}>;
//# sourceMappingURL=aragSetup.d.ts.map