"use client";

import type React from "react";
import Link from "next/link";
import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { files_table, folders_table } from "~/server/db/schema";

import { FileTableItem, FolderTableItem } from "./FileTableItem";
import { UploadButton } from "~/components/ui/uploadthing";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import Modal from "~/components/ui/modal";

const DriveContents: React.FC<{
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useRouter();

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <div className="mb-4 flex items-center justify-between">
        <nav className="flex text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1">
            <li className="m-0 inline-flex items-center">
              <Link href="/f/1" className="text-blue-400 hover:text-blue-600">
                My Drive
              </Link>
            </li>
            {props.parents.map((folder) => (
              <li key={folder.id} className="inline-flex items-center">
                <span className="mx-2 text-gray-500">/</span>
                <Link
                  href={`/f/${folder.id}`}
                  className="text-blue-400 hover:text-blue-600"
                >
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
      <div className="overflow-hidden rounded-lg border border-gray-700">
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
              <FolderTableItem key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileTableItem key={file.id} file={file} />
            ))}
          </TableBody>
        </Table>
      </div>
      <UploadButton
        endpoint={"driveUploader"}
        onClientUploadComplete={() => navigate.refresh()}
        input={{ folderId: props.currentFolderId }}
      />
      <div className="flex items-center justify-center">
        <Button onClick={() => setIsModalOpen(true)} className="my-4">
          Create Folder
        </Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Folder"
        currentFolderId={props.currentFolderId}
      >
        Create a new folder
      </Modal>
    </div>
  );
};

export default DriveContents;
