import { useCustomRequest } from "@/features/custom-request";
import { useSession } from "@/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useCustomReqCommonStates = (image: string) => {
  const context = useCustomRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const { productType } = useParams();
  const user = useSession((state) => state.user);
  const router = useRouter();

  const loadingState = { isLoading, setIsLoading };
  const loadingMsgState = { loadingMessage, setLoadingMessage };
  const errorsState = { errors, setErrors };

  useEffect(() => {
    return () => {
      context?.setProductImageUrl(image);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    context,
    loadingState,
    loadingMsgState,
    errorsState,
    user,
    router,
    productType,
  };
};
