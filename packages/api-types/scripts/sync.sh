#!/usr/bin/env bash
# Refresh the vendored type snapshot of the partner-forge API.
#
# Strategy: clone (or update) a sibling checkout of partner-forge, build all
# its workspace packages, then copy the resulting .d.ts files into
# vendored/ and deps/. We strip .js and source maps — this package is types
# only, never executes at runtime.
#
# Run from the web repo root:
#   ./packages/api-types/scripts/sync.sh [path-to-partner-forge]
#
# Defaults to ../partner-forge.

set -euo pipefail

SRC="${1:-../partner-forge}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -d "$SRC" ]; then
  echo "partner-forge checkout not found at $SRC" >&2
  echo "Pass the path as the first arg, or clone it alongside this repo." >&2
  exit 1
fi

echo "→ Building partner-forge workspace at $SRC"
(cd "$SRC" && npm install --silent && npm run build --silent)

echo "→ Refreshing $HERE/vendored from $SRC/apps/api/dist"
rm -rf "$HERE/vendored"
mkdir -p "$HERE/vendored"
cp -R "$SRC/apps/api/dist/." "$HERE/vendored/"

for pkg in shared db arag-client salesforce sharepoint; do
  echo "→ Refreshing $HERE/deps/$pkg from $SRC/packages/$pkg/dist"
  rm -rf "$HERE/deps/$pkg/dist"
  mkdir -p "$HERE/deps/$pkg/dist"
  cp -R "$SRC/packages/$pkg/dist/." "$HERE/deps/$pkg/dist/"
done

# Type-only: strip everything that isn't a .d.ts
find "$HERE/vendored" "$HERE/deps" \
  \( -name "*.js" -o -name "*.js.map" -o -name "*.d.ts.map" \) -delete

echo "✓ Vendored types refreshed."
