import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { createBackup } from "@/lib/backup";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    logger.warn("Unauthorized backup attempt detected.");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  logger.info("Authorized cron job request received. Starting backup...");

  try {
    const backupData = await createBackup();
    const backupJson = JSON.stringify(backupData, null, 2);
    const timestamp = new Date().toISOString().replaceAll(":", "-");
    const filename = `wrdraft-backup-${timestamp}.json`;

    // Upload the backup file to Vercel Blob
    const { url } = await put(filename, backupJson, {
      access: "public", // Corrected: Must be 'public' on the Hobby plan
      contentType: "application/json",
    });

    logger.info(
      { count: backupData.length, url },
      "Backup created and uploaded to Vercel Blob successfully."
    );

    // Return a success response, not the file itself
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
