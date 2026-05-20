export declare function isApiPath(url: string): boolean;
/**
 * Built-SPA locations. Portal served at `/`, Console at `/console`.
 * Returns nulls in dev (no dist) — Vite serves the frontends then.
 */
export declare function staticPaths(): {
    portalDir: string | null;
    consoleDir: string | null;
};
