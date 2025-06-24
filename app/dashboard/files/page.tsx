'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
const RenameDialog = dynamic(() => import('@/components/RenameDialog'));
const DeleteDialog = dynamic(() => import('@/components/DeleteDialog'));
import Spinner from '@/components/Spinner';
import { Pencil, Trash } from 'lucide-react';


type Folder = {
  id: string;
  name: string;
};

type FileRecord = {
  id: string;
  name: string;
  path: string;
  type?: string;
  folder_id: string | null;
};

export default function FilesPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const fetchAll = async () => {
    const [foldersRes, filesRes] = await Promise.all([
      fetch("/api/folders/list"),
      fetch("/api/files/list"),
    ]);

    if (!foldersRes.ok || !filesRes.ok) {
      toast.error("Failed to load folders or files");
      return;
    }

    const foldersData = await foldersRes.json();
    const filesData = await filesRes.json();

    setFolders(foldersData);
    setFiles(filesData);
  };

  const getFilesInFolder = (folderId: string | null) =>
    files.filter((file) => String(file.folder_id) === String(folderId));

  const handleUpload = async () => {
    if (!file || !selectedFolderId) {
      toast.error("Select both file and folder");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", selectedFolderId);

    setUploading(true);
    const res = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });
    setUploading(false);

    if (res.ok) {
      toast.success("File uploaded");
      setFile(null);
      fetchAll();
    } else {
      toast.error("Upload failed");
    }
  };

  const renameFile = async (fileId: string, newName: string) => {
    const res = await fetch("/api/files/rename", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId, newName }),
    });

    if (res.ok) {
      toast.success("File renamed");
      fetchAll(); 
    } else {
      toast.error("Rename failed");
    }
  };

  const deleteFile = async (fileId: string, filePath: string) => {
    const res = await fetch("/api/files/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId, filePath }),
    });

    if (res.ok) {
      toast.success("File deleted");
      fetchAll();
    } else {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-10">
      <h2 className="text-2xl font-bold text-center sm:text-left">Manage & Upload Files</h2>

      {/* Upload Form */}
      <div className="bg-white border p-4 rounded shadow space-y-4">
        <h3 className="font-semibold text-lg">Upload a File</h3>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selectedFolderId ?? ""}
            onChange={(e) => setSelectedFolderId(e.target.value || null)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select a folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {uploading && <Spinner />}
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      {/* Uncategorized Files */}
      {getFilesInFolder(null).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-blue-800">Uncategorized</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getFilesInFolder(null).map((file) => {
              const url = `${supabaseUrl}/storage/v1/object/public/files/${file.path}`;
              return (
                <li key={file.id} className="p-3 border rounded hover:bg-gray-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium break-all"
                    >
                      📄 {file.name}
                    </a>
                    <div className="flex gap-2">
                      <RenameDialog
                        currentName={file.name}
                        onConfirm={(newName) => renameFile(file.id, newName)}
                        trigger={
                          <button className="text-blue-600 hover:text-blue-800" title="Rename">
                            <Pencil size={18} />
                          </button>
                        }
                      />
                      <DeleteDialog
                        onConfirm={() => deleteFile(file.id, file.path)}
                        trigger={
                          <button className="text-red-600 hover:text-red-800" title="Delete">
                            <Trash size={18} />
                          </button>
                        }
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Foldered Files */}
      {files.length === 0 ? (
        <p className="text-gray-500 text-center">You haven't uploaded any files yet.</p>
      ) : (
        folders.map((folder) => {
          const folderFiles = getFilesInFolder(folder.id);
          return (
            <div key={folder.id} className="space-y-3">
              <h3 className="text-xl font-semibold text-blue-800">{folder.name}</h3>
              {folderFiles.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No files in this folder.</p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {folderFiles.map((file) => {
                    const url = `${supabaseUrl}/storage/v1/object/public/files/${file.path}`;
                    return (
                      <li key={file.id} className="p-3 border rounded hover:bg-gray-50 space-y-2">
                        <div className="flex justify-between items-center">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium break-all"
                          >
                            {file.name}
                          </a>
                          <div className="flex gap-2">
                            <RenameDialog
                              currentName={file.name}
                              onConfirm={(newName) => renameFile(file.id, newName)}
                              trigger={
                                <button className="text-blue-600 hover:text-blue-800" title="Rename">
                                  <Pencil size={18} />
                                </button>
                              }
                            />
                            <DeleteDialog
                              onConfirm={() => deleteFile(file.id, file.path)}
                              trigger={
                                <button className="text-red-600 hover:text-red-800" title="Delete">
                                  <Trash size={18} />
                                </button>
                              }
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
