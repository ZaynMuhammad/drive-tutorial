import type React from "react"

import { type Folder } from "~/mockData";
import { TableCell, TableRow } from "~/components/ui/table";
import { FolderIcon, FileIcon } from "lucide-react";
import type { files, folders } from "~/server/db/schema";

const FileTableItem: React.FC<{ file: (typeof files.$inferSelect); }> = ({ file }) => {
    return (
        <TableRow className="hover:bg-gray-800 cursor-pointer">
          <TableCell className="font-medium">
            <div className="flex items-center">
                <FileIcon className="w-5 h-5 mr-2 text-gray-500" />
                <a href={file.url} className="text-blue-400 hover:underline" target="_blank">
                  {file.name}
                </a>
            </div>
          </TableCell>
          <TableCell>{"File"}</TableCell>
          <TableCell>{file.size}</TableCell>
        </TableRow>
      ) 
}

const FolderTableItem: React.FC<{ folder: (typeof folders.$inferSelect); onNavigate: () => void }> = ({ folder, onNavigate }) => {
  return (
    <TableRow className="hover:bg-gray-800 cursor-pointer" onClick={onNavigate}>
      <TableCell className="font-medium">
        <div className="flex items-center">
          <FolderIcon className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-gray-300">{folder.name}</span>
        </div>
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  ) 
} 

export { FileTableItem, FolderTableItem };