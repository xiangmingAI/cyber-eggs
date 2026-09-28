import type { APIRoute } from "astro";
import { getEggs, serializeEgg } from "../../../lib/eggs";

export const prerender = true;

export const GET: APIRoute = async () => {
  const eggs = await getEggs();

  return new Response(
    JSON.stringify(
      {
        version: "1",
        generatedAt: new Date().toISOString(),
        demo: true,
        items: eggs.map(serializeEgg),
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
};
