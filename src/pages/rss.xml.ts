import type { APIRoute } from "astro";
import { getEggs } from "../lib/eggs";

export const prerender = true;

const entities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => entities[character]);

export const GET: APIRoute = async ({ site }) => {
  const eggs = await getEggs();
  const origin = site ?? new URL("http://localhost:4321");
  const items = eggs
    .map(
      (egg) => `<item>
  <title>${escapeXml(`${egg.data.provider} · ${egg.data.title}`)}</title>
  <link>${new URL(`eggs/${egg.id}/`, origin)}</link>
  <guid>${new URL(`eggs/${egg.id}/`, origin)}</guid>
  <description>${escapeXml(egg.data.summary)}</description>
  <pubDate>${new Date(`${egg.data.verifiedAt}T00:00:00Z`).toUTCString()}</pubDate>
</item>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>cyber-eggs / 赛博鸡蛋</title>
  <link>${origin}</link>
  <description>AI 免费配额雷达（人工审核发布）</description>
  ${items}
</channel>
</rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
