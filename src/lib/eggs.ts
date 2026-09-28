import { getCollection, type CollectionEntry } from "astro:content";

export type EggEntry = CollectionEntry<"eggs">;

const statusOrder: Record<EggEntry["data"]["status"], number> = {
  fresh: 0,
  expiring: 1,
  stale: 2,
  expired: 3,
};

export async function getEggs(): Promise<EggEntry[]> {
  const eggs = await getCollection("eggs");

  return eggs.sort(
    (left, right) =>
      Number(right.data.featured) - Number(left.data.featured) ||
      statusOrder[left.data.status] - statusOrder[right.data.status] ||
      left.data.provider.localeCompare(right.data.provider),
  );
}

export function serializeEgg(entry: EggEntry) {
  return { id: entry.id, ...entry.data };
}
