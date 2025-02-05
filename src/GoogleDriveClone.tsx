"use client"

import type React from "react"
import { useState } from "react"
import { type FileItem, initialData } from "./mockData"
import { FolderIcon, FileIcon, UploadIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

const FileTableItem: React.FC<{ item: FileItem; onNavigate: (item: FileItem) => void }> = ({ item, onNavigate }) => {
  const handleClick = () => {
    if (item.type === "folder") {
      onNavigate(item)
    }
  }

  return (
    <TableRow className="hover:bg-gray-800 cursor-pointer" onClick={handleClick}>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {item.type === "folder" ? (
            <FolderIcon className="w-5 h-5 mr-2 text-blue-500" />
          ) : (
            <FileIcon className="w-5 h-5 mr-2 text-gray-500" />
          )}
          {item.type === "file" ? (
            <a href={`#file-${item.id}`} className="text-blue-400 hover:underline">
              {item.name}
            </a>
          ) : (
            <span className="text-gray-300">{item.name}</span>
          )}
        </div>
      </TableCell>
      <TableCell>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</TableCell>
      <TableCell>{item.size || "-"}</TableCell>
    </TableRow>
  )
}

const GoogleDriveClone: React.FC = () => {
  const [data, setData] = useState<FileItem[]>(initialData)
  const [currentPath, setCurrentPath] = useState<FileItem[]>([])

  const handleUpload = () => {
    const newFile: FileItem = {
      id: `${Date.now()}`,
      name: `New File ${data.length + 1}.txt`,
      type: "file",
      size: "10 KB",
    }
    setData([...data, newFile])
  }

  const handleNavigate = (item: FileItem) => {
    if (item.type === "folder") {
      setCurrentPath([...currentPath, item])
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  const currentFolder = currentPath.length > 0 ? currentPath[currentPath.length - 1] : { children: data }

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <nav className="flex text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="#"
                onClick={() => setCurrentPath([])}
                className="inline-flex items-center text-blue-400 hover:text-blue-600"
              >
                Home
              </a>
            </li>
            {currentPath.map((item, index) => (
              <li key={item.id}>
                <div className="flex items-center">
                  <span className="text-gray-500 mx-2">/</span>
                  <a
                    href="#"
                    onClick={() => handleBreadcrumbClick(index)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    {item.name}
                  </a>
                </div>
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
            {currentFolder.children?.map((item) => (
              <FileTableItem key={item.id} item={item} onNavigate={handleNavigate} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default GoogleDriveClone

