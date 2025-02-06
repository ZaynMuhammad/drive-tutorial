"use client"

import type React from "react"
import { useState } from "react"
import { type FileItem, type Folder, mockFiles, mockFolders } from "./mockData"
import { UploadIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/components/ui/table"

import FileTableItem from "./components/ui/FileTableItem"

type Item = FileItem | Folder

const GoogleDriveClone: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<Folder>(mockFolders.find((f) => f.id === "root")!)
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([currentFolder])

  const getCurrentFolderContents = () => {
    const folders = mockFolders.filter((folder) => folder.parent === currentFolder.id)
    const files = mockFiles.filter((file) => file.parent === currentFolder.id)
    return [...folders, ...files]
  }

  const handleNavigate = (item: Item) => {
    if (item.type === "file") {
      return;
    }

    setCurrentFolder(item)
    if (breadcrumbs[breadcrumbs.length - 1].id !== item.id) {
      setBreadcrumbs([...breadcrumbs, item])
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
    setBreadcrumbs(newBreadcrumbs)
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1])
  }

  const handleUpload = () => {
    // Implement file upload logic here
    console.log("File upload clicked")
  }

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <nav className="flex text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((folder, index) => (
              <li key={folder.id} className="inline-flex items-center">
                {index > 0 && <span className="text-gray-500 mx-2">/</span>}
                <a href="#" onClick={() => handleBreadcrumbClick(index)} className="text-blue-400 hover:text-blue-600">
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
            {getCurrentFolderContents().map((item) => (
              <FileTableItem
                key={item.id}
                item={item}
                onNavigate={() => handleNavigate(item)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default GoogleDriveClone

