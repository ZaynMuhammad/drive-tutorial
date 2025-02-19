"use client"

import type React from "react"
import Link from "next/link"
import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import type { files_table, folders_table } from "~/server/db/schema";

import { FileTableItem, FolderTableItem } from "./FileTableItem"
import { UploadButton } from "~/components/ui/uploadthing"
import { useRouter } from "next/navigation"

const DriveContents: React.FC<{
    files: typeof files_table.$inferSelect[];
    folders: typeof folders_table.$inferSelect[];
    parents: typeof folders_table.$inferSelect[];
}> = (props) => {
  const navigate = useRouter();
  return (
    <div className="container mx-auto p-4 text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <nav className="flex text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1">
              <li className="inline-flex items-center m-0">
                <Link href="/f/1" className="text-blue-400 hover:text-blue-600">
                  My Drive
                </Link>
            </li>
            {props.parents.map((folder) => (
              <li key={folder.id} className="inline-flex items-center">
                <span className="text-gray-500 mx-2">/</span>
                <Link href={`/f/${folder.id}`} className="text-blue-400 hover:text-blue-600">
                  {folder.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
      </div>
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {props.folders.map((folder) => (
              <FolderTableItem
                key={folder.id}
                folder={folder}
              />
            ))}
            {props.files.map((file) => (
              <FileTableItem
                key={file.id}
                file={file}
              />
            ))}
          </TableBody>
        </Table>
      </div>
        <UploadButton endpoint={"imageUploader"} onClientUploadComplete={() => navigate.refresh()} />
    </div>
  )
}

export default DriveContents

