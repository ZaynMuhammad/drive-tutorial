"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { mockFiles, mockFolders } from "./mockData"
import { UploadIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/components/ui/table"

import { FileTableItem, FolderTableItem } from "./app/FileTableItem"

const GoogleDriveClone: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<string>("root")

  const getCurrentFolderContents = () => {
    return mockFolders.filter((folder) => folder.parent === currentFolder)
  }

  const getCurrentFile = () => {
    return mockFiles.filter((file) => file.parent === currentFolder)
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId)
  }

  const handleUpload = () => {
    // Implement file upload logic here
    console.log("File upload clicked")
  }

  const breadcrumbs = useMemo(() => {
    const breadcrumbs = []
    let currentId = currentFolder

    while (currentId !== "root") {
      const folder = mockFolders.find((folder) => folder.id === currentId)

      if (folder) {
        breadcrumbs.unshift(folder)
        currentId = folder.parent ?? "root"
      } else {
        break;
      }
    }

    return breadcrumbs
  }, [currentFolder])

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <nav className="flex text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1">
              <li className="inline-flex items-center m-0">
                <a href="#" onClick={() => setCurrentFolder("root")} className="text-blue-400 hover:text-blue-600">
                  My Drive
                </a>
            </li>
            {breadcrumbs().map((folder, index) => (
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
          {getCurrentFolderContents().map((folder) => (
              <FolderTableItem
                key={folder.id}
                folder={folder}
                onNavigate={() => handleFolderClick(folder.id)}
              />
            ))}
            {getCurrentFile().map((file) => (
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

export default GoogleDriveClone

