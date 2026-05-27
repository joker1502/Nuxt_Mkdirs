import { sanityClient } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import type { QueryParams } from "next-sanity";

/**
 * Sanity data fetching — adapted for Nuxt (removed next/headers draftMode dependency)
 *
 * In development: uses previewDrafts perspective to see unpublished content
 * In production:  uses published perspective with CDN caching (60s TTL)
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective = process.env.NODE_ENV === "development"
    ? "previewDrafts"
    : "published",
  disableCache,
}: {
  query: string;
  params?: QueryParams;
  perspective?: "previewDrafts" | "published";
  disableCache?: boolean;
}) {
  if (perspective === "previewDrafts") {
    return sanityClient.fetch<QueryResponse>(query, params, {
      perspective: "previewDrafts",
      token,
      useCdn: false,
      next: { revalidate: 0 },
    });
  }
  return sanityClient.fetch<QueryResponse>(query, params, {
    perspective: "published",
    useCdn: !disableCache,
    next: { revalidate: disableCache ? 0 : 60 },
  });
}
