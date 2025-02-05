export interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: string
  children?: FileItem[]
}

export const initialData: FileItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    size: "-",
    children: [
      { id: "2", name: "Resume.pdf", type: "file", size: "250 KB" },
      { id: "3", name: "Cover Letter.docx", type: "file", size: "75 KB" },
    ],
  },
  {
    id: "4",
    name: "Photos",
    type: "folder",
    size: "-",
    children: [
      { id: "5", name: "Vacation.jpg", type: "file", size: "2.5 MB" },
      { id: "6", name: "Family.png", type: "file", size: "3.2 MB" },
    ],
  },
  { id: "7", name: "Project Proposal.pptx", type: "file", size: "1.8 MB" },
]

