import type React from "react"

import { type FileItem, type Folder } from "~/mockData";
import { TableCell, TableRow } from "~/components/ui/table";
import { FolderIcon, FileIcon } from "lucide-react";

type Item = FileItem | Folder

const FileTableItem: React.FC<{ item: Item; onNavigate: (item: Item) => void }> = ({ item, onNavigate }) => {
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
                <a href={item.url} className="text-blue-400 hover:underline">
                  {item.name}
                </a>
              ) : (
                <span className="text-gray-300">{item.name}</span>
              )}
            </div>
          </TableCell>
          <TableCell>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</TableCell>
          <TableCell>{item.type === "file" ? item.size : "-"}</TableCell>
        </TableRow>
      ) 
}

export default FileTableItem;