import { useState, useEffect } from "react";

const useWindow = () => {
  const [windowObject, setWindowObject] = useState<Window | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowObject(window);
    }
  }, []);

  return windowObject;
};

export default useWindow;
