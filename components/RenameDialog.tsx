'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
  trigger: React.ReactNode;
  currentName: string;
  onConfirm: (newName: string) => void;
};

export default function RenameDialog({ trigger, currentName, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(currentName);

  const handleConfirm = () => {
    if (newName.trim() && newName !== currentName) {
      onConfirm(newName.trim());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>

        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
``
