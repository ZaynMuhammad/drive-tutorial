import type React from "react";
import { useRef } from "react";
import Link from "next/link";

import { TableCell, TableRow } from "~/components/ui/table";
import { FolderIcon, FileIcon, Trash2 } from "lucide-react";
import type { files_table, folders_table } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolder } from "~/server/actions";

const FileTableItem: React.FC<{ file: typeof files_table.$inferSelect }> = ({
  file,
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName !== "A") {
      linkRef.current?.click();
    }
  };

  // Replace this with deleteFile to prevent event propagation and triggering the file click
  const handleDelete = (
    event: React.MouseEvent<HTMLTableRowElement>,
    fileId: number,
  ) => {
    event.stopPropagation();
    deleteFile(fileId);
  };

  return (
    <TableRow
      className="cursor-pointer hover:bg-gray-800"
      onClick={handleRowClick}
    >
      <TableCell className="font-medium">
        <div className="flex items-center">
          <FileIcon className="mr-2 h-5 w-5 text-gray-500" />
          <a
            ref={linkRef}
            href={file.url}
            className="text-blue-400 hover:underline"
            target="_blank"
          >
            {file.name}
          </a>
        </div>
      </TableCell>
      <TableCell>{"File"}</TableCell>
      <TableCell>{file.size}</TableCell>
      <TableCell>
        <Button onClick={() => deleteFile(file.id)} aria-label="Delete file">
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
};

const FolderTableItem: React.FC<{
  folder: typeof folders_table.$inferSelect;
}> = ({ folder }) => {
  return (
    <TableRow className="cursor-pointer hover:bg-gray-800">
      <TableCell className="font-medium">
        <Link
          href={`/f/${folder.id}`}
          className="text-blue-400 hover:underline"
        >
          <div className="flex items-center text-blue-400 hover:underline">
            <FolderIcon className="mr-2 h-5 w-5 text-blue-500" />
            <span className="text-gray-300">{folder.name}</span>
          </div>
        </Link>
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        {/* <Button
          onClick={() => deleteFolder(folder.id)}
          aria-label="Delete folder"
        >
          <Trash2 />
        </Button> */}
      </TableCell>
    </TableRow>
  );
};

export { FileTableItem, FolderTableItem };
