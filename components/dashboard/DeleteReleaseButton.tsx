'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteReleaseButton({ releaseId, redirectTo }: { releaseId: string; redirectTo?: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this release? This cannot be undone.')) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/releases/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseId }),
      });

      if (res.ok) {
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
          window.location.reload();
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete release.');
        setDeleting(false);
      }
    } catch {
      alert('Failed to delete release.');
      setDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 px-3 py-1.5 gap-1.5"
    >
      {deleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      <span className="text-xs font-medium">Delete</span>
    </Button>
  );
}
