/**
 * @jest-environment node
 */
import { describe, expect, it, jest } from "@jest/globals";

import { getKvClient } from "@/lib/upstash";
import { SavedDraft } from "@/types/draft";

import { createBackup } from "./backup";

jest.mock("@/lib/upstash");

const mockGetKvClient = getKvClient as jest.Mock;

describe("createBackup", () => {
  it("should return an empty array if the database has no drafts", async () => {
    mockGetKvClient.mockReturnValue({
      zrange: jest.fn<() => Promise<string[]>>().mockResolvedValue([]),
      mget: jest.fn(),
    });

    const backup = await createBackup();
    expect(backup).toEqual([]);
  });

  it("should return all valid drafts from the database", async () => {
    const mockDrafts: SavedDraft[] = [
      { id: "draft1", picks: {} } as SavedDraft,
      { id: "draft2", picks: {} } as SavedDraft,
    ];

    mockGetKvClient.mockReturnValue({
      zrange: jest
        .fn<() => Promise<string[]>>()
        .mockResolvedValue(["draft1", "draft2"]),
      mget: jest
        .fn<() => Promise<SavedDraft[]>>()
        .mockResolvedValue(mockDrafts),
    });

    const backup = await createBackup();
    expect(backup).toHaveLength(2);
    expect(backup[0].id).toBe("draft1");
  });

  it("should filter out null or corrupted entries", async () => {
    const mockDrafts: (SavedDraft | null)[] = [
      { id: "draft1", picks: {} } as SavedDraft,
      null, // Corrupted entry
    ];

    mockGetKvClient.mockReturnValue({
      zrange: jest
        .fn<() => Promise<string[]>>()
        .mockResolvedValue(["draft1", "draft2"]),
      mget: jest
        .fn<() => Promise<(SavedDraft | null)[]>>()
        .mockResolvedValue(mockDrafts),
    });

    const backup = await createBackup();
    expect(backup).toHaveLength(1);
    expect(backup[0].id).toBe("draft1");
  });
});
