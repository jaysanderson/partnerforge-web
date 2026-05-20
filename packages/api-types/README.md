# @partnerforge/api (type-only)

A vendored snapshot of the [partner-forge](https://github.com/jaysanderson/partner-forge)
backend's tRPC `AppRouter` type, plus the transitive `@partnerforge/*` type
packages it references (db / shared / salesforce / sharepoint / arag-client).

This package exists so the web frontends in this repo can keep using
`inferRouterInputs<AppRouter>` / `inferRouterOutputs<AppRouter>` for typed
REST calls **without depending on the API repo at runtime**. The wire
contract is REST (documented at `/docs`); types are just for IDE
autocomplete + compile-time safety.

## When to refresh

When the partner-forge API adds or changes a procedure's input/output
shape, run:

```
scripts/sync.sh
```

That clones partner-forge into a sibling directory, builds it, and copies
the freshly-generated `.d.ts` files into `vendored/` and `deps/`.

A future PR may swap this whole package out for `openapi-typescript` codegen
against `https://partnerforge-prgs.fly.dev/docs/json`, once we've backfilled
response schemas into the API's REST routes.
