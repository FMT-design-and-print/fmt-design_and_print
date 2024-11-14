import { usePathname, useRouter } from "next/navigation";
import useWindow from "./useWindow";

export const useUrlSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const windowObj = useWindow();

  const updateUrlSearchParams = (
    paramsToUpdate: Record<string, string | number | null | undefined>
  ) => {
    const search = windowObj ? windowObj.location.search : "";
    const queryParams = new URLSearchParams(search);

    Object.keys(paramsToUpdate).forEach((key) => {
      const value = paramsToUpdate[key];
      if (value == null) {
        queryParams.delete(key);
      } else {
        if (queryParams.has(key)) {
          queryParams.set(key, value.toString());
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const newUrl = `${pathname}?${queryParams.toString()}`;

    router.push(newUrl);
  };

  return updateUrlSearchParams;
};
