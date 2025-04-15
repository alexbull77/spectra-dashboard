import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { sessionQueryOptions } from "../sessionQueryOptions";
import { upsertSession, ISession } from "@/api";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

export const CreateSessionDialog: React.FC<{
  selectedSession: ISession | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedSession: Dispatch<SetStateAction<ISession | null>>;
}> = ({ selectedSession, open, setOpen, setSelectedSession }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(selectedSession?.name || "");
  }, [selectedSession]);

  const { user } = useUser();

  const { mutate: upsert, isPending } = useMutation({
    mutationKey: sessionQueryOptions.all,
    mutationFn: upsertSession,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isPending) return;
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedSession ? "Edit session" : "Create session"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end gap-x-4">
          <DialogClose asChild>
            <Button
              disabled={isPending}
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                setName("");
              }}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (!name.length) return;

              upsert(
                { id: selectedSession?.id, name, user_id: user?.id },
                {
                  onSuccess: () => {
                    setOpen(false);
                    setName("");
                    if (selectedSession) {
                      toast("Session edited successfully");
                    } else {
                      toast("Session created successfully");
                    }
                    setSelectedSession(null);
                  },
                }
              );
            }}
          >
            {selectedSession ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
