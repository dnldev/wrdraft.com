/**
 * @file Contains the core logic for creating a backup of user data.
 */
import { getKvClient } from "@/lib/upstash";
import { SavedDraft } from "@/types/draft";

const KEY_PREFIX = "WR:";
const DRAFTS_KEY = `${KEY_PREFIX}drafts:history`;
const DRAFT_PREFIX = "WR:draft:";

/**
 * Fetches all draft objects from the Upstash database.
 * @returns {Promise<SavedDraft[]>} A promise that resolves to an array of all saved drafts.
 */
export async function createBackup(): Promise<SavedDraft[]> {
  const kv = getKvClient();

  // Fetch all draft IDs from the sorted set.
  const allDraftIds = await kv.zrange<string[]>(DRAFTS_KEY, 0, -1);

  if (allDraftIds.length === 0) {
    return [];
  }

  // Prepare the keys for mget
  const draftKeys = allDraftIds.map((id) => `${DRAFT_PREFIX}${id}`);

  // Fetch all draft objects in a single batch request
  const drafts = await kv.mget<SavedDraft[]>(...draftKeys);

  // Filter out any null/corrupted entries
  return drafts.filter((d): d is SavedDraft => d !== null);
}
