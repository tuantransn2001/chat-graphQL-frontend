import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../gql/graphql";

interface UserState {
  id: number | undefined;
  avatarUrl: string | null;
  fullname: string;
  email?: string;
  updateProfileImage: (image: string) => void;
  updateUsername: (name: string) => void;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: undefined,
      fullname: "",
      email: "",
      avatarUrl: null,

      updateProfileImage: (image: string) => set({ avatarUrl: image }),
      updateUsername: (name: string) => set({ fullname: name }),
      setUser: (user) =>
        set({
          id: user.id || undefined,
          avatarUrl: user.avatarUrl,
          fullname: user.fullname,
          email: user.email,
        }),
    }),
    {
      name: "user-store",
    }
  )
);
export const userSelector = (state: UserState) => state;
export const setUserSelector = (state: UserState) => state.setUser;
export const userIdSelector = (state: UserState) => state.id;
export const avatarUrlSelector = (state: UserState) => state.avatarUrl;
export const updateProfileImageSelector = (state: UserState) =>
  state.updateProfileImage;
export const fullnameSelector = (state: UserState) => state.fullname;
export const updateUsernameSelector = (state: UserState) =>
  state.updateUsername;
