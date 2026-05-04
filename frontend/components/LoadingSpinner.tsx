"use client";

type LoadingSpinnerProps = {
  className?: string;
};

export default function LoadingSpinner({ className = "" }: LoadingSpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 ${className}`}
    />
  );
}
