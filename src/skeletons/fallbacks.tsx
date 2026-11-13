function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export function PostCardFallback() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Bone className="h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <Bone className="h-3 w-40" />
          <Bone className="h-3 w-24" />
        </div>
      </div>
      <Bone className="h-16 w-full" />
      <Bone className="h-56 w-full rounded-2xl" />
      <div className="grid grid-cols-4 gap-2">
        <Bone className="h-9" />
        <Bone className="h-9" />
        <Bone className="h-9" />
        <Bone className="h-9" />
      </div>
    </article>
  );
}

export function HomeFallback() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] py-6 w-full">
      <div className="w-full px-2 sm:px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_340px] gap-6 items-start">
        <aside className="hidden lg:block space-y-5">
          <Bone className="h-56 rounded-3xl" />
          <Bone className="h-64 rounded-3xl" />
        </aside>
        <main className="w-full max-w-[720px] justify-self-center space-y-6">
          <Bone className="h-36 rounded-2xl" />
          <PostCardFallback />
          <PostCardFallback />
        </main>
        <aside className="hidden xl:block space-y-5">
          <Bone className="h-72 rounded-3xl" />
        </aside>
      </div>
    </div>
  );
}

export function ProfileFallback() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24 w-full px-4 sm:px-8 lg:px-12 pt-6 space-y-8">
      <Bone className="h-80 w-full rounded-3xl" />
      <Bone className="h-14 w-full rounded-2xl" />
      <div className="max-w-3xl mx-auto space-y-6">
        <PostCardFallback />
        <PostCardFallback />
      </div>
    </div>
  );
}

export function NotificationsFallback() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Bone className="h-28 rounded-3xl" />
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Bone className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Bone className="h-3 w-3/4" />
                <Bone className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SuggestionsFallback() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Bone className="h-28 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Bone key={index} className="h-24 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PostDetailsFallback() {
  return (
    <div className="my-8 max-w-3xl mx-auto px-4">
      <PostCardFallback />
    </div>
  );
}

export function NavbarUserFallback() {
  return <Bone className="h-10 w-10 rounded-full" />;
}
