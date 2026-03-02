import prisma from "../db.server";

// Public endpoint — Shopify storefront fetches brand counts from here
export const loader = async () => {
  const brandCounts = await prisma.brandCount.findMany({
    orderBy: { count: "desc" },
  });

  return new Response(JSON.stringify(brandCounts), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
