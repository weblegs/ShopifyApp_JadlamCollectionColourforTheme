$env:NODE_OPTIONS = '--require ' + (Resolve-Path 'fs-patch.cjs').Path
npx shopify app dev
