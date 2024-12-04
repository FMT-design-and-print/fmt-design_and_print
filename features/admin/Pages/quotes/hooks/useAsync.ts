import { useState, useCallback } from "react";
import { toast } from "react-toastify";

interface UseAsyncOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  options: UseAsyncOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args);
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        if (options.errorMessage) {
          toast.error(options.errorMessage);
        }
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn, options]
  );

  return {
    execute,
    isLoading,
    error,
  };
}
