import React, { useState } from "react";
import { Button } from "./button";
import { X, Check } from "lucide-react";
import { createFolderAuth } from "~/server/actions";
import { useFormStatus } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentFolderId: number;
  children: React.ReactNode;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="bg-green-600 text-white hover:bg-green-700"
      size="sm"
      disabled={pending}
    >
      <Check className="mr-1 h-4 w-4" /> {pending ? "Creating..." : "Confirm"}
    </Button>
  );
}

export default function Modal({
  isOpen,
  onClose,
  setIsOpen,
  title,
  currentFolderId,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  const [folderName, setFolderName] = useState("");

  async function handleCreateFolder(
    formData: FormData,
    currentFolderId: number,
  ) {
    try {
      await createFolderAuth(formData, currentFolderId);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  }

  return (
    <form
      action={(formData) => handleCreateFolder(formData, currentFolderId)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-700 bg-background p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-300">{title}</h3>
        </div>

        <div className="mb-6 text-gray-300">
          {children}
          <input
            type="text"
            name="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-background p-2 text-gray-300 focus:border-blue-500 focus:outline-none"
            placeholder="Folder name"
          />
        </div>

        <div className="flex items-center justify-between">
          <SubmitButton />

          <Button
            onClick={onClose}
            type="button"
            variant="destructive"
            size="sm"
          >
            <X className="mr-1 h-4 w-4" /> Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
