'use client';
import { useState } from 'react';
import { Trash } from 'lucide-react';

interface DeleteConfirmProps { onConfirm: () => void; children: React.ReactNode; }

export default function DeleteConfirm({ onConfirm, children }: DeleteConfirmProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>{children}</button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
          <div className="bg-[var(--card)] p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 transform scale-100 transition-transform">
            <h3 className="text-lg font-bold mb-4 text-[var(--card-foreground)]">Confirm Delete</h3>
            <p className="mb-6 text-[var(--muted-foreground)]">Are you sure? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-md bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/90">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90 flex items-center">
                <Trash size={16} className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}