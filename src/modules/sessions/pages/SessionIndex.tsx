import { useMutation, useQuery } from "@tanstack/react-query";
import { sessionQueryOptions } from "../sessionQueryOptions";
import { CreateSessionDialog } from "../components/CreateSessionDialog";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { deleteSession, ISession } from "@/api";
import { format, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useState } from "react";

const useColumns = (
  setSelectedSession: Dispatch<SetStateAction<ISession | null>>,
  setDialogOpen: Dispatch<SetStateAction<boolean>>
): ColumnDef<ISession>[] => {
  const { mutate: deleteSessionById } = useMutation({
    mutationKey: sessionQueryOptions.all,
    mutationFn: deleteSession,
  });

  const { user } = useUser();

  return [
    {
      accessorKey: "id",
      header: () => <div className="text-right">ID</div>,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="text-right">NAME</div>,
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "created_at",
      header: () => <div className="text-right">CREATED</div>,
      cell: ({ row }) => (
        <div>
          {format(parseISO(row.original.created_at), "dd.mm.yyyy HH:MM")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row: { original } }) => {
        return (
          <div className="w-fit">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  disabled={user?.id !== original.user_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSession(original);
                    setDialogOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={user?.id !== original.user_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSessionById(original.id, {
                      onSuccess: () => toast("Session successfully deleted"),
                    });
                  }}
                >
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

export const SessionIndex = () => {
  const { user } = useUser();
  const { data: sessions, isFetching } = useQuery(
    sessionQueryOptions.sessions(user?.id)
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);

  const columns = useColumns(setSelectedSession, setDialogOpen);
  const navigate = useNavigate();

  return (
    <div className="w-screen h-[calc(100vh-40px)] p-8 bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">Sessions</h1>
          <CreateSessionDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            selectedSession={selectedSession}
            setSelectedSession={setSelectedSession}
          />
        </div>

        <DataTable
          columns={columns}
          data={sessions}
          isFetching={isFetching}
          onRowClick={(session) => navigate(`/sessions/${session.id}`)}
        />
      </div>
    </div>
  );
};
