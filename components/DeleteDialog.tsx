'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
  trigger: React.ReactNode;
  onConfirm: () => void;
  message?: string;
};

export default function DeleteDialog({ trigger, onConfirm, message }: Props) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">{message || 'Are you sure you want to delete this? This action cannot be undone.'}</p>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
