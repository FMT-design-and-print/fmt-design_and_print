import { useCustomRequest } from "@/features/custom-request";
import { useSession } from "@/store";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export const useCustomReqCommonStates = () => {
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
