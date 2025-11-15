import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { createBackup } from "@/lib/backup";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    logger.warn("Unauthorized backup attempt detected.");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  logger.info("Authorized cron job request received. Starting backup...");

  try {
    const backupData = await createBackup();
    const backupJson = JSON.stringify(backupData, null, 2);
    const timestamp = new Date()
      .toISOString()
      .split(".")[0]
      .replaceAll(":", "-");
    const filename = `wrdraft-backup-${timestamp}.json`;

    const { url } = await put(filename, backupJson, {
      access: "public",
      contentType: "application/json",
    });

    logger.info(
      { count: backupData.length, url },
      "Backup created and uploaded to Vercel Blob successfully."
    );

    return NextResponse.json({
      success: true,
      message: `Backup created with ${backupData.length} entries.`,
      backupUrl: url,
    });
  } catch (error) {
    logger.error(error, "Failed to create or upload backup.");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
