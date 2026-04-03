import { useEffect, useRef, useState } from "react";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";

interface PostActionsMenuProps {
  canDelete?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
}

export default function PostActionsMenu({
  canDelete = false,
  isDeleting = false,
  onDelete,
}: PostActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!canDelete) return null;

  return (
    <div className="relative flex-shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-full"
        aria-label="Post actions"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 min-w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete?.();
            }}
            disabled={isDeleting}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>{isDeleting ? "Deleting..." : "Delete post"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
