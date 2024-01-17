import React, { useEffect } from "react";
import { useUserStore, userIdSelector } from "../stores/userStore";
import {
  toggleLoginModalSelector,
  useGeneralStore,
} from "../stores/generalStore";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const userId = useUserStore(userIdSelector);
  const toggleLoginModal = useGeneralStore(toggleLoginModalSelector);

  useEffect(() => {
    if (!userId) {
      toggleLoginModal();
    }
  }, [toggleLoginModal, userId]);
  if (userId) {
    return children;
  }
  return <>Protected</>;
};

export default ProtectedRoutes;
