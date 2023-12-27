import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type SessionStore = {
  session: Session | null;
  user: User | undefined;
  setSession: (session: Session | null) => void;
  setUser: (user: User | undefined) => void;
};

export const useSession = create<SessionStore>((set) => ({
  session: null,
  user: undefined,
  setSession: (session) => set(() => ({ session })),
  setUser: (user) => set(() => ({ user })),
}));
