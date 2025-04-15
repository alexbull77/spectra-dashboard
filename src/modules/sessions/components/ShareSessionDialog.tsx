import { deleteSharedSession, fetchUsersSharedSession } from "@/api";
import { insertSharedSession } from "@/api/mutations/insertSharedSession.mutation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Share } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ShareSessionDialog: React.FC<{
  sessionId: string;
  disabled?: boolean;
}> = ({ sessionId, disabled = false }) => {
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  const { data } = useQuery({
    queryKey: ["allSharedUsers", sessionId, user?.id],
    queryFn: () => fetchUsersSharedSession(sessionId, user?.id),
  });

  const { mutate: unshare, isPending: unsharing } = useMutation({
    mutationKey: ["allSharedUsers"],
    mutationFn: deleteSharedSession,
  });

  const { mutate: share, isPending: sharing } = useMutation({
    mutationKey: ["allSharedUsers"],
    mutationFn: insertSharedSession,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          Share
          <Share />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share session</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          {data?.users.map(({ id, username }) => {
            const hasAccess = !!data?.shared_sessions?.find(
              (s) => s.user_id === id
            );

            return (
              <div
                key={id}
                className="flex gap-x-2 border border-gray-300 p-2 rounded-full hover:shadow-lg hover:cursor-pointer w-fit px-4 items-center"
                onClick={() => {
                  if (sharing || unsharing) return;
                  return hasAccess
                    ? unshare(
                        { session_id: sessionId, user_id: id },
                        {
                          onSuccess: () =>
                            toast("Successfully stopped sharing"),
                        }
                      )
                    : share(
                        { session_id: sessionId, user_id: id },
                        {
                          onSuccess: () => toast("Successfully shared"),
                        }
                      );
                }}
              >
                <Checkbox checked={hasAccess} />
                <span>{username}</span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
