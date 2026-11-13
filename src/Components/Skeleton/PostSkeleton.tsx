export function PostSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md w-full p-4 sm:p-5 space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-slate-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-200 rounded w-1/4" />
        </div>
      </div>

      {/* Body text */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
      </div>

      {/* Image box */}
      <div className="h-64 bg-slate-200 rounded-xl w-full" />

      {/* Actions footer */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100">
        <div className="h-9 bg-slate-200 rounded-xl" />
        <div className="h-9 bg-slate-200 rounded-xl" />
        <div className="h-9 bg-slate-200 rounded-xl" />
        <div className="h-9 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-64 sm:h-80 w-full bg-slate-200" />
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-slate-300 border-4 border-white" />
            <div className="h-10 w-28 bg-slate-200 rounded-2xl" />
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded w-48" />
            <div className="h-4 bg-slate-200 rounded w-32" />
          </div>
          <div className="h-16 bg-slate-100 rounded-2xl mt-4 w-full max-w-2xl" />
        </div>
      </div>
    </div>
  );
}

export function SuggestionSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3.5 flex-1">
        <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
      <div className="w-20 h-9 bg-slate-200 rounded-2xl shrink-0" />
    </div>
  );
}
