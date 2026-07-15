import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="space-y-3 py-6">
      <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-slate-200" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="h-32 w-full animate-pulse rounded-md bg-slate-200 lg:w-48" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
