import { Loader2 } from 'lucide-react';

export function ButtonLoader({ className }: { className?: string }) {
  return <Loader2 className={`w-4 h-4 animate-spin ${className || ''}`} />;
}
