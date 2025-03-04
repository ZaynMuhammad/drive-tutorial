"use server";

import { and, eq, inArray } from "drizzle-orm";
import { files_table, folders_table } from "./db/schema";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { MUTATIONS } from "./db/queries";

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

export async function createFolderAuth(formData: FormData, parentId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  const folderName = formData.get("folderName") as string;
  // const parentId = Number(formData.get("parentId"));

  if (!folderName) {
    throw new Error("Folder name is required");
  }

  await MUTATIONS.createFolder({
    folder: {
      name: folderName,
      ownerId: session.userId,
      parent: parentId,
    },
  });

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [folder] = await db
    .select()
    .from(folders_table)
    .where(
      and(
        eq(folders_table.id, folderId),
        eq(folders_table.ownerId, session.userId),
      ),
    );

  if (!folder) {
    return { error: "Folder not found" };
  }

  // delete all sub files in current dir
  const subFiles = await db
    .delete(files_table)
    .where(eq(files_table.parent, folderId));

  console.log("subfiles: ", subFiles);

  // Need to go through and find all sub folders and then delete them. Need to check and delete all sub files in the
  // sub folders too...

  // Iterative approach to delete all subfolders and files
  const folderQueue = [folderId];
  const foldersToDelete = [folderId];

  // First, identify all folders that need to be deleted
  while (folderQueue.length > 0) {
    const currentFolderId = folderQueue.shift()!;

    // Find all subfolders
    const subFolders = await db
      .select({ id: folders_table.id })
      .from(folders_table)
      .where(
        and(
          eq(folders_table.parent, currentFolderId),
          eq(folders_table.ownerId, session.userId),
        ),
      );

    // Add subfolders to both queues
    for (const { id } of subFolders) {
      folderQueue.push(id);
      foldersToDelete.push(id);
    }
  }

  console.log(`Found ${foldersToDelete.length} folders to delete`);

  // Delete all files in all identified folders
  if (foldersToDelete.length > 0) {
    const filesDeleteResult = await db
      .delete(files_table)
      .where(
        and(
          inArray(files_table.parent, foldersToDelete),
          eq(files_table.ownerId, session.userId),
        ),
      );

    console.log("Deleted Folders: ", filesDeleteResult);
    // Delete all folders (except the root one which we'll delete separately)
    const subFoldersToDelete = foldersToDelete.filter((id) => id !== folderId);
    if (subFoldersToDelete.length > 0) {
      const foldersDeleteResult = await db
        .delete(folders_table)
        .where(
          and(
            inArray(folders_table.id, subFoldersToDelete),
            eq(folders_table.ownerId, session.userId),
          ),
        );

      console.log("Deleted Folders: ", foldersDeleteResult);
    }
  }

  // Delete the root folder itself
  const rootFolderDeleteResult = await db
    .delete(folders_table)
    .where(eq(folders_table.id, folderId));

  console.log("Root folder delete result:", rootFolderDeleteResult);

  const c = await cookies();
  // Hack to revalidate page after delete
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
