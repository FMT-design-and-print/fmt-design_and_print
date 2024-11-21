import { useState, useEffect, useCallback } from "react";
import { hasPermission as isPermitted } from "@/functions/permisions";
import { Permission, Role } from "@/types/roles";
import { createClient } from "@/utils/supabase/client";

export const usePermission = () => {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw new Error("Failed to fetch session");
        }

        const user = data.session?.user;

        if (user) {
          const role =
            user.user_metadata?.role || user.app_metadata?.role || "viewer";
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const hasPermission = useCallback(
    (requiredPermission: Permission) => {
      if (!userRole) {
        return false;
      }
      return isPermitted(userRole, requiredPermission);
    },
    [userRole]
  );

  return { hasPermission, loading, error };
};
