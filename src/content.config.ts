import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const eggSchema = z.object({
  provider: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  kind: z.enum(["recurring", "signup", "limited", "grant"]),
  status: z.enum(["fresh", "expiring", "stale", "expired"]),
  quota: z.object({
    label: z.string().min(1),
    reset: z.enum(["once", "daily", "monthly", "ongoing"]),
  }),
  modalities: z.array(z.enum(["text", "image", "audio", "video", "embedding"])).min(1),
  regions: z.array(z.string().min(1)).min(1),
  requirements: z.object({
    card: z.boolean().nullable(),
    phone: z.boolean().nullable(),
    kyc: z.boolean().nullable(),
  }),
  claimUrl: z.url(),
  sourceUrl: z.url(),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  featured: z.boolean().default(false),
  demo: z.literal(true),
  steps: z.array(z.string().min(1)).min(1).max(5),
});

const eggs = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/data/eggs" }),
  schema: eggSchema,
});

export const collections = { eggs };
