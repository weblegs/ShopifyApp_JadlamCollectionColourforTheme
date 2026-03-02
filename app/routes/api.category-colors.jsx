import prisma from "../db.server";

// Public endpoint — Shopify storefront fetches category colors from here
export const loader = async () => {
  const colors = await prisma.categoryDetail.findMany({
    orderBy: { mainCategory: "asc" },
  });

  return new Response(JSON.stringify(colors), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
