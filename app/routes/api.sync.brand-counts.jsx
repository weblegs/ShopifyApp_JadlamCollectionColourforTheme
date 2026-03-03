import prisma from "../db.server";

const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          vendor
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// POST /api/sync/brand-counts
// Protected by SYNC_SECRET env var.
// Trigger via: curl -X POST https://<app-url>/api/sync/brand-counts \
//              -H "x-sync-secret: <your-secret>"
export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const secret = request.headers.get("x-sync-secret");
  if (!process.env.SYNC_SECRET || secret !== process.env.SYNC_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Use the stored offline session to get the shop + access token
  const session = await prisma.session.findFirst({
    where: { isOnline: false },
    orderBy: { id: "desc" },
  });

  if (!session) {
    return new Response(
      JSON.stringify({ error: "No offline session found. Install the app first." }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const { shop, accessToken } = session;
  const vendorMap = new Map();
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const response = await fetch(
      `https://${shop}/admin/api/2026-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: PRODUCTS_QUERY,
          variables: { first: 250, after: endCursor },
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      return new Response(
        JSON.stringify({ error: data.errors[0].message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    for (const edge of data?.data?.products?.edges ?? []) {
      const vendor = edge.node?.vendor || "Unknown";
      vendorMap.set(vendor, (vendorMap.get(vendor) ?? 0) + 1);
    }

    hasNextPage = data?.data?.products?.pageInfo?.hasNextPage ?? false;
    endCursor = data?.data?.products?.pageInfo?.endCursor ?? null;
  }

  // Upsert each vendor — update count if exists, insert if new
  await Promise.all(
    Array.from(vendorMap.entries()).map(([vendorName, count]) =>
      prisma.brandCount.upsert({
        where: { vendorName },
        update: { count },
        create: { vendorName, count },
      })
    )
  );

  // Delete vendors that no longer exist in Shopify
  const activeVendors = Array.from(vendorMap.keys());
  await prisma.brandCount.deleteMany({
    where: { vendorName: { notIn: activeVendors } },
  });

  return new Response(
    JSON.stringify({ success: true, synced: vendorMap.size }),
    { headers: { "Content-Type": "application/json" } }
  );
};
