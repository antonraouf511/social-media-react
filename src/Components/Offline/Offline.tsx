import { useState } from "react";

function WifiOffIcon({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h.01" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
      <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
      <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
      <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
      <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function RefreshIcon({ size = 16, spinning = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={spinning ? "animate-spin" : ""}
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

export default function OfflineScreen({ onRetry }: { onRetry?: () => void | Promise<void> }) {
  const [checking, setChecking] = useState(false);

  const handleRetry = async () => {
    if (checking) return;
    setChecking(true);
    try {
      if (onRetry) {
        await onRetry();
      } else if (navigator.onLine) {
        window.location.reload();
      }
    } finally {
      setTimeout(() => setChecking(false), 600);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 text-center fixed inset-0 z-50 bg-[#F7F7F6] text-black">
      <div
        role="alert"
        className="w-full max-w-[440px] rounded-[28px] bg-white px-8 pb-8 pt-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      >
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-neutral-200 bg-[#faf9f7] text-neutral-900">
          <WifiOffIcon />
        </div>

        <h1 className="mb-3 text-[22px] font-semibold text-neutral-900">
          You're Offline
        </h1>

        <p className="mx-auto mb-8 max-w-[340px] text-[16px] leading-relaxed text-neutral-500">
          It looks like you're not connected to the internet. Check your
          connection and try again.
        </p>

        <button
          type="button"
          onClick={handleRetry}
          disabled={checking}
          className="inline-flex items-center gap-2 rounded-xl bg-[#131217] px-6 py-3 text-[15px] font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-80 cursor-pointer"
        >
          <RefreshIcon spinning={checking} />
          Try Again
        </button>

        <p className="mt-6 text-[12px] text-neutral-400">
          Your connection will be checked again when you retry.
        </p>
      </div>
    </div>
  );
}
