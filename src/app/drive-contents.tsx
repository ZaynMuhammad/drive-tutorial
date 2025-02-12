"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"

import { UploadIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import type { files, folders } from "~/server/db/schema";

import { FileTableItem, FolderTableItem } from "./FileTableItem"

const DriveContents: React.FC<{
    files: typeof files.$inferSelect[];
    folders: typeof folders.$inferSelect[];
}> = (props) => {
  const [currentFolder, setCurrentFolder] = useState<number>(1);

  const handleUpload = () => {
    // Implement file upload logic here
    console.log("File upload clicked")
  }

  const breadcrumbs: unknown = []; 

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
            {breadcrumbs.map((folder) => (
              <li key={folder.id} className="inline-flex items-center">
                <span className="text-gray-500 mx-2">/</span>
                <Link href={`/f/${folder.id}`} className="text-blue-400 hover:text-blue-600">
                  {folder.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <Button onClick={handleUpload} className="flex items-center">
          <UploadIcon className="w-4 h-4 mr-2" />
          Upload File
        </Button>
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
    </div>
  )
}

export default DriveContents

