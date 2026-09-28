import type { APIRoute } from "astro";
import { getEggs } from "../../../lib/eggs";

export const prerender = true;

export const GET: APIRoute = async () => {
  const eggs = await getEggs();
  const statuses = Object.fromEntries(
    ["fresh", "expiring", "stale", "expired"].map((status) => [
      status,
      eggs.filter((egg) => egg.data.status === status).length,
    ]),
  );

  return new Response(
    JSON.stringify({ version: "1", generatedAt: new Date().toISOString(), count: eggs.length, statuses }, null, 2),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
};
