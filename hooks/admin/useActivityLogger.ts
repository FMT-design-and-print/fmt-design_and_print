import { createClient } from "@/utils/supabase/client";
import { ActivityAction, ActivityEntityType } from "@/types/admin";
import { useCurrentAdminUser } from "./useCurrentAdminUser";
import { useCallback } from "react";

export interface LogActivityParams {
  action: ActivityAction | string;
  entity_type: ActivityEntityType | string;
  entity_id?: string;
  description: string;
  metadata?: Record<string, any>;
  user_details?: {
    userId?: string;
    name?: string;
    role?: string;
    image?: string;
  };
}

export function useActivityLogger() {
  const supabase = createClient();
  const { adminUser } = useCurrentAdminUser();

  const logActivity = useCallback(
    async (params: LogActivityParams) => {
      // Build user details if not provided explicitly
      const userDetails = params.user_details || (adminUser ? {
        userId: adminUser.id,
        name: `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim() || adminUser.email,
        role: adminUser.role,
        image: adminUser.avatar,
      } : undefined);

      try {
        const { error } = await supabase.from("activity_logs").insert([
          {
            ...params,
            user_details: userDetails,
          },
        ]);

        if (error) {
          console.error("Failed to log activity:", error);
        }
      } catch (err) {
        console.error("Failed to log activity exception:", err);
      }
    },
    [adminUser] // removed supabase from deps as createClient inside component can cause loops if not careful, though it's usually stable
  );

  return { logActivity };
}
