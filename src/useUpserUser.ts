import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { upsertUser } from "./api";

export const useUpsertUser = () => {
  const { user } = useUser();

  useEffect(() => {
    upsertUser({ id: user?.id, username: user?.username });
  }, [user]);

  return null;
};
