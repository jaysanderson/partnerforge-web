# PartnerForge Web

Frontends for the PartnerForge platform — the internal console + the
partner portal. Both are React + Vite SPAs that consume the public
REST API documented at `https://partnerforge-prgs.fly.dev/docs`.

| App | Path | Lives at |
| --- | --- | --- |
| Internal console | `apps/console` | `/console` |
| Partner portal | `apps/portal` | `/` |

## How it deploys

This repo doesn't deploy itself. The backend repo
[partner-forge](https://github.com/jaysanderson/partner-forge) clones this
one at Docker build time and bakes both SPAs' built `dist/` directories
into the API image. Everything runs on a single Fly machine
(`partnerforge-prgs.fly.dev`).

To deploy: push to `main` here, then trigger a deploy from the API repo
(or wait for its CI to do it).

## Local development

```bash
npm install
npm run dev          # both SPAs at once
```

Set `VITE_API_URL=http://localhost:4000` in `apps/console/.env.local` and
`apps/portal/.env.local` to point at a local backend. Default behavior
expects same-origin `/v1/*`.

## Repo layout

```
apps/
  console/              # Internal staff app (admin, partners, deals, …)
  portal/               # Partner-facing app (sf account, forms, library, …)
packages/
  ui/                   # Shared design system (AppShell, DataTable, …)
  api-types/            # Type-only snapshot of the API's tRPC AppRouter
    vendored/           # Copied from partner-forge/apps/api/dist
    deps/               # Type-only @partnerforge/{shared,db,salesforce,…}
    scripts/sync.sh     # Refresh from a sibling partner-forge checkout
```

## Updating API types

When the backend adds or changes a procedure, refresh the vendored types:

```bash
# Have ../partner-forge checked out alongside this repo, then:
npm run sync-api-types
```

## Calling the API

Both apps use the same pattern (see `apps/console/src/api/hooks.ts` and
`apps/portal/src/api/hooks.ts`):

```ts
const partners = useApi.partners.list();
const create = useApi.partners.create();
create.mutate({ name: '…', tier: 'Gold', /* … */ });
```

Under the hood this is plain `fetch` calls against `/v1/*`, wrapped in
react-query. Auth is `Authorization: Bearer <jwt>` for browser sessions or
`X-Api-Key: <key>` for service integrations. See `/docs` for the full
endpoint catalog.
