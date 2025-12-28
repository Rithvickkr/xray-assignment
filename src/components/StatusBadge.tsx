
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, string> = {
    success: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30",
    warning: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30",
    error: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30",
  };

  const icons = {
    success: "✓",
    warning: "⚠",
    error: "✗",
  };

  return (
    <Badge className={`${variants[status] || variants.success} flex items-center gap-1.5 px-3 py-1 font-medium`}>
      <span className="text-xs">{icons[status]}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}