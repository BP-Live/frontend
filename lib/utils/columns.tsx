import * as Checkbox from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { BusinessCategorie } from "@/lib/types";

export const columns: ColumnDef<BusinessCategorie>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox.Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox.Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "All",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
];
