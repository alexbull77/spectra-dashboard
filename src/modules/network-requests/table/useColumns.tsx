import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Instance } from "mobx-state-tree";
import { NetworkRequest } from "../mst/NetworkRequests.store";

export const useColumns = (): ColumnDef<Instance<typeof NetworkRequest>>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-right">ID</div>,
    cell: ({ row }) => <div>{row.original.id}</div>,
  },
  {
    accessorKey: "url",
    header: () => <div className="text-right">URL</div>,
    cell: ({ row }) => <div>{row.original.url}</div>,
  },
  {
    accessorKey: "method",
    header: () => <div className="text-right">METHOD</div>,
    cell: ({ row }) => <div>{row.original.method}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">STATUS</div>,
    cell: ({ row }) => <div>{row.original.status}</div>,
  },
  {
    accessorKey: "size",
    header: () => <div className="text-right">SIZE</div>,
    cell: ({ row }) => <div>{row.original.response_size_bytes} b</div>,
  },
  {
    accessorKey: "time_taken",
    header: () => <div className="text-right">TIME TAKEN</div>,
    cell: ({ row }) => <div>{row.original.time_taken_ms} ms</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
