import { isAdminUser } from "@/functions/user";
import { IUserDetails } from "@/types/user";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient();

export const useSaveInitialUserDetails = () => {
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);

  useEffect(() => {
    const localStorageKey = "fmt_initialUserDetailsSaved";
    const isDetailsSaved = localStorage.getItem(localStorageKey);

    const fetchUserDetails = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && !isAdminUser(session.user)) {
          if (!isDetailsSaved) {
            const { error, data } = await supabase
              .from("users")
              .select(
                "id, email, confirmed, firstName, lastName, profileImage, phone, country, region, gender, dateOfBirth"
              )
              .eq("id", session.user.id);

            if (error) {
              throw error;
            }

            if (data && data.length > 0) {
              // User details exist in the database
              setUserDetails(data[0]);
              localStorage.setItem(localStorageKey, "true");
            } else {
              // User details not found, save new details to database
              const { user } = session;

              const userDetails = {
                id: user.id,
                email: user.email,
                provider: user.app_metadata.provider,
                firstName: user.user_metadata.full_name || "",
                profileImage: user.user_metadata.avatar_url || "",
                phone: user.phone || "",
                confirmed: true,
              };

              const { error: insertError } = await supabase
                .from("users")
                .insert([userDetails])
                .select();

              if (insertError) {
                throw insertError;
              }

              // Set localStorage to indicate details are saved
              localStorage.setItem(localStorageKey, "true");
              setUserDetails(userDetails);
            }
          } else {
            // Details are already saved
          }
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error.message);
      }
    };
    if (!isDetailsSaved) {
      fetchUserDetails();
    }
  }, []);

  return userDetails;
};
