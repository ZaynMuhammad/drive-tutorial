"use client"

import type React from "react"
import { useMemo, useState } from "react"
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

  const handleFolderClick = (folderId: number) => {
    setCurrentFolder(folderId)
  }

  const handleUpload = () => {
    // Implement file upload logic here
    console.log("File upload clicked")
  }

  const breadcrumbs = useMemo(() => {
    const breadcrumbs = []
    let currentId = currentFolder

    while (currentId !== 1) {
      const folder = props.folders.find((folder) => folder.id === currentId)

      if (folder) {
        breadcrumbs.unshift(folder)
        currentId = folder.parent ?? 1
      } else {
        break;
      }
    }

    return breadcrumbs
  }, [currentFolder, props.folders])

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <nav className="flex text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1">
              <li className="inline-flex items-center m-0">
                <a href="#" onClick={() => setCurrentFolder(1)} className="text-blue-400 hover:text-blue-600">
                  My Drive
                </a>
            </li>
            {breadcrumbs.map((folder) => (
              <li key={folder.id} className="inline-flex items-center">
                <span className="text-gray-500 mx-2">/</span>
                <a href="#" onClick={() => setCurrentFolder(folder.id)} className="text-blue-400 hover:text-blue-600">
                  {folder.name}
                </a>
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
                onNavigate={() => handleFolderClick(folder.id)}
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

