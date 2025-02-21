"use server";

import { and, eq } from "drizzle-orm";
import { files_table } from "./db/schema";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

// Handle validations here, exposing endpoint on FE so need to do the necessary checks for a POST
export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }
  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  // Should update db to include the file key in the file table instead of this
  const utApiResult = await utApi.deleteFiles([
    file.url.replace("https://utfs.io/", ""),
  ]);

  console.log(utApiResult);

  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  console.log(dbDeleteResult);

  const c = await cookies();
  // Hack to revalidate page after delete
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
