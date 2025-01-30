"use client";

import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SearchParamsProvider({ children, fallback }: Props) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="w-full h-full min-h-[50px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}
