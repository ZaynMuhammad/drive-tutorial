import type React from "react"
import { useRef } from "react"
import Link from "next/link"

import { TableCell, TableRow } from "~/components/ui/table";
import { FolderIcon, FileIcon } from "lucide-react";
import type { files, folders } from "~/server/db/schema";

const FileTableItem: React.FC<{ file: (typeof files.$inferSelect); }> = ({ file }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'A') {
        linkRef.current?.click();
    }
  }
    return (
        <TableRow className="hover:bg-gray-800 cursor-pointer" onClick={handleRowClick}>
          <TableCell className="font-medium">
            <div className="flex items-center">
                <FileIcon className="w-5 h-5 mr-2 text-gray-500" />
                <a ref={linkRef} href={file.url} className="text-blue-400 hover:underline" target="_blank">
                  {file.name}
                </a>
            </div>
          </TableCell>
          <TableCell>{"File"}</TableCell>
          <TableCell>{file.size}</TableCell>
        </TableRow>
      ) 
}

const FolderTableItem: React.FC<{ folder: (typeof folders.$inferSelect); }> = ({ folder  }) => {

  return (
    <TableRow className="hover:bg-gray-800 cursor-pointer">
      <TableCell className="font-medium">
        <Link href={`/f/${folder.id}`} className="text-blue-400 hover:underline">
          <div className="flex items-center text-blue-400 hover:underline">
            <FolderIcon className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-gray-300">{folder.name}</span>
          </div>
        </Link>
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  ) 
} 

export { FileTableItem, FolderTableItem };