import { useCallback } from "react";
import DOMPurify from "isomorphic-dompurify";

const useSanitize = () => {
  const sanitize = useCallback((dirtyString: string) => {
    return DOMPurify.sanitize(dirtyString);
  }, []);

  return sanitize;
};

export default useSanitize;
