export declare function isApiPath(url: string): boolean;
/**
 * Built-SPA locations. Portal served at `/`, Console at `/console`.
 *
 * The frontends live in a separate repo
 * (https://github.com/jaysanderson/partnerforge-web). The production
 * Dockerfile clones it at build time and copies the built dist into the
 * paths checked below — so this lookup stays unchanged whether the SPAs
 * are built in-tree (legacy) or from the web repo.
 *
 * Returns nulls in local dev (no dist present) — Vite serves the
 * frontends from the web repo's own `npm run dev` then.
 */
export declare function staticPaths(): {
    portalDir: string | null;
    consoleDir: string | null;
};
//# sourceMappingURL=static.d.ts.map