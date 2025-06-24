'use client';
import dynamic from 'next/dynamic';
const RenameDialog = dynamic(() => import('@/components/RenameDialog'));
const DeleteDialog = dynamic(() => import('@/components/DeleteDialog'));
import Spinner from '@/components/Spinner';
import { Pencil, Trash } from 'lucide-react';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Folder = {
  id: string;
  name: string;
};

export default function FoldersPage() {
    
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFolders = async () => {
    const res = await fetch("/api/folders/list");
    const data = await res.json();
    setFolders(data);
  };

  const createFolder = async () => {
    if (!folderName.trim()) return toast("Enter a folder name");
    setLoading(true);
    const res = await fetch("/api/folders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Folder created");
      setFolderName('');
      fetchFolders();
    } else {
      toast.error("Failed to create folder");
    }
  };

  const deleteFolder = async (folderId: string) => {
    const res = await fetch("/api/folders/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderId }), 
    });
  
    if (res.ok) {
      toast.success("Folder deleted");
      fetchFolders();
    } else {
      const message = await res.text();
      toast.error(`Delete failed: ${message}`);
    }
  };
  

  const renameFolder = async (folderId: string, newName: string) => {
   
    const res = await fetch("/api/folders/rename", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId, newName }), 
    });
  
    if (res.ok) {
      toast.success("Folder renamed");
      fetchFolders();
    } else {
      toast.error("Failed to rename");
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold"> Manage Folders</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New folder name"
          className="border p-2 rounded w-full"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button
            onClick={createFolder}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded disabled:bg-green-400 bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed"
            >
            {loading && <Spinner />}
            {loading ? "Creating..." : "Create"}
        </button>
      </div>

      <div className="space-y-2">
        {folders.length === 0 ? (
          <p className="text-gray-500">No folders yet.</p>
        ) : (
          folders.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center justify-between border p-3 rounded hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                 {folder.name}
              </div>
              <div className="space-x-2">
                 <RenameDialog
                    currentName={folder.name}
                    onConfirm={(newName) => renameFolder(folder.id, newName)}
                    trigger={
                    <button className="text-blue-600 hover:underline" title="Rename">
                      <Pencil size={18} />
                    </button>
                    }
                />
                 <DeleteDialog
                    onConfirm={() => deleteFolder(folder.id)}
                    trigger={
                        <button className="text-red-600 hover:underline" title="Delete">
                           <Trash size={18} />
                        </button>
                    }
                    />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
