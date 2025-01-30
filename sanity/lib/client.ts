import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Read-only client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

// Client for mutations (requires token)
export const writableClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Required for mutations
  token: process.env.NEXT_PUBLIC_SANITY_ADMIN_TOKEN, // Add this token to your .env.local
});
