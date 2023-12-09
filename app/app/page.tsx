"use client";

import { getLocation, saveLocation } from "@/lib/utils/storage";
import { ExitIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { BusinessCategorie, RestaurantJson } from "@/lib/types";
import * as Dropdown from "@/components/ui/dropdown-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapSegment } from "@/components/map-segment";
import * as Checkbox from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import AvailablePlaceIcon from "@/public/open.png";
import BusinessIcon from "@/public/business.png";
import * as Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as Table from "@/components/ui/table";
import * as Form from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import { logoutAPI } from "../api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as z from "zod";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const data: BusinessCategorie[] = [
  {
    id: "Metro Station",
    category: "Metro Station",
  },
  {
    id: "Train Station",
    category: "Train Station",
  },
  {
    id: "Park",
    category: "Park",
  },
  {
    id: "Restaurant",
    category: "Restaurant",
  },
  {
    id: "Night Club",
    category: "Night Club",
  },
  {
    id: "ATM",
    category: "ATM",
  },
  {
    id: "Cafe",
    category: "Cafe",
  },
  {
    id: "Grocery or supermarket",
    category: "Grocery or supermarket",
  },
  {
    id: "Post office",
    category: "Post office",
  },
];

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

const promptSchema = z.object({
  prompt: z.string().min(10, {
    message: "Your company description must be at least 10 characters.",
  }),
});

const BUDAPEST = [47.497913, 19.040236];

export default function AppPage() {
  const { setTheme } = useTheme();
  const router = useRouter();

  const [[latitude, longitude], setLocation] = useState(BUDAPEST);

  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const [skipLocationDialog, setSkipLocationDialog] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDialog, setLocationDialog] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptDialog, setPromptDialog] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [json, setJson] = useState<RestaurantJson | null>(null);

  const [selectionArray, setSelectionArray] = useState<string[]>([]);

  useEffect(() => {
    const selectedCategories = data
      .filter((_, index) => {
        return Object.keys(rowSelection).includes(index.toString());
      })
      .map((item) => item.category);

    setSelectionArray(selectedCategories);
  }, [rowSelection]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  useEffect(() => {
    console.log(json);
  }, [json]);

  useEffect(() => {
    const location = getLocation();

    if (location) {
      setLocation([location.lat, location.lng]);
      setSkipLocationDialog(true);
      setLocationDialog(false);
      setPromptDialog(true);
    }

    if (skipLocationDialog || locationDialog || location) return;

    setLocationDialog(true);
  }, [locationDialog]);

  function onPrompt(values: z.infer<typeof promptSchema>) {
    setPromptLoading(true);

    const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WS}/ws`);

    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          longitude,
          latitude,
          prompt: values.prompt,
        }),
      );
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setJson((json) => ({ ...json, ...data }));
    };

    setPromptLoading(false);
    setPromptDialog(false);
  }

  const onLocation = () => {
    setLocationLoading(true);

    if (locationErrorMessage) {
      saveLocation({
        lat: BUDAPEST[0],
        lng: BUDAPEST[1],
      });

      setLocationLoading(false);
      setSkipLocationDialog(true);
      setLocationDialog(false);
      setPromptDialog(true);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log(position.coords.latitude, position.coords.longitude);
          setLocation([position.coords.latitude, position.coords.longitude]);

          saveLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setLocationLoading(false);
          setSkipLocationDialog(true);
          setLocationDialog(false);
          setPromptDialog(true);
        },
        (error) => {
          setLocationLoading(false);
          setLocationErrorMessage(error.message);
        },
      );
    } else {
      setLocationLoading(false);
      setLocationErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  const handleLogout = async () => {
    await logoutAPI();

    const rootUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string;
    window.location.href = rootUrl.startsWith("https")
      ? rootUrl
      : `https://${rootUrl}`;
  };

  return (
    <>
      <div className="fixed top-0 left-0 bottom-1/4 lg:bottom-0 right-0 lg:right-1/3">
        <MapSegment json={json} categories={selectionArray} />
      </div>

      <div className="fixed bottom-6 left-6 z-10 flex items-center gap-3">
        <div className="w-[10rem] h-[9rem] bg-white rounded-lg flex flex-col items-center justify-start pt-2">
          <p className="font-bold text-primary text-center">Labels</p>
          <div className="flex items-center justify-between w-full px-3 mt-3">
            <Image
              src={BusinessIcon}
              alt="Business Icon"
              className="w-3 lg:w-4 cursor-pointer hover:scale-125 scale-100 transition-all duration-300 pointer-events-auto"
            />
            <p className="text-sm">Businesses</p>
          </div>
          <div className="flex items-center justify-between w-full px-3 mt-2">
            <Image
              src={AvailablePlaceIcon}
              alt="Available Icon"
              className="w-3 lg:w-4 cursor-pointer hover:scale-125 scale-100 transition-all duration-300 pointer-events-auto"
            />
            <p className="text-sm whitespace-nowrap">Available places</p>
          </div>
        </div>
      </div>

      <div className="fixed top-6 left-6 z-10 flex items-center gap-3">
        <Dropdown.DropdownMenu>
          <Dropdown.DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <span className="sr-only">Toggle theme</span>
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </Dropdown.DropdownMenuTrigger>
          <Dropdown.DropdownMenuContent align="start">
            <Dropdown.DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </Dropdown.DropdownMenuItem>
            <Dropdown.DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </Dropdown.DropdownMenuItem>
            <Dropdown.DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </Dropdown.DropdownMenuItem>
          </Dropdown.DropdownMenuContent>
        </Dropdown.DropdownMenu>

        <Button variant="secondary" size="icon" onClick={handleLogout}>
          <span className="sr-only">Sign Out</span>
          <ExitIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>

        <Dropdown.DropdownMenu>
          <Dropdown.DropdownMenuTrigger asChild>
            <Button>Select Categories</Button>
          </Dropdown.DropdownMenuTrigger>
          <Dropdown.DropdownMenuContent className="w-56 mt-4" align="center">
            <div className="rounded-md ">
              <Table.Table>
                <Table.TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Table.TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <Table.TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </Table.TableHead>
                        );
                      })}
                    </Table.TableRow>
                  ))}
                </Table.TableHeader>
                <Table.TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <Table.TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Table.TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Table.TableCell>
                        ))}
                      </Table.TableRow>
                    ))
                  ) : (
                    <Table.TableRow>
                      <Table.TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </Table.TableCell>
                    </Table.TableRow>
                  )}
                </Table.TableBody>
              </Table.Table>
            </div>
          </Dropdown.DropdownMenuContent>
        </Dropdown.DropdownMenu>
      </div>

      <div
        className={cn(
          "absolute top-3/4 lg:top-0 left-0 lg:left-2/3 bottom-0 right-0 p-6 flex flex-col justify-center z-20 bg-background min-h-[90vh] lg:min-h-[100vh]",
        )}
      >
        <div className="flex w-full items-center justify-center absolute top-2 left-0 z-[999] block lg:hidden">
          <div className="w-1/6 h-[3px] bg-gray-200" />
        </div>
        {json && (
          <div className="h-full flex flex-col gap-6 lg:gap-2">
            <div className="h-[100%] flex flex-col justify-start overflow-y-auto relative hideScrollbar">
              <div className="w-full flex items-center gap-2">
                <Progress value={json.progress || 0} />
                <p className="-mt-[2px] font-bold text-primary whitespace-nowrap">
                  {json.progress} %
                </p>
              </div>

              <Table.Table>
                <Table.TableHeader>
                  <Table.TableRow>
                    <Table.TableHead className="text-center" colSpan={2}>
                      Details
                    </Table.TableHead>
                  </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                  <Table.TableRow>
                    <Table.TableCell>Type</Table.TableCell>
                    <Table.TableCell>{json.metadata?.type}</Table.TableCell>
                  </Table.TableRow>
                  <Table.TableRow>
                    <Table.TableCell>Name</Table.TableCell>
                    <Table.TableCell>{json.metadata?.name}</Table.TableCell>
                  </Table.TableRow>
                  <Table.TableRow>
                    <Table.TableCell>Location</Table.TableCell>
                    <Table.TableCell>
                      {json.metadata?.location_name}
                    </Table.TableCell>
                  </Table.TableRow>
                </Table.TableBody>
              </Table.Table>

              <Table.Table>
                <Table.TableHeader>
                  <Table.TableRow>
                    <Table.TableHead className="text-center">
                      Pros
                    </Table.TableHead>
                  </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                  {json.pros?.map((pro) => (
                    <Table.TableRow key={pro}>
                      <Table.TableCell>{pro}</Table.TableCell>
                    </Table.TableRow>
                  ))}
                </Table.TableBody>
              </Table.Table>

              <Table.Table>
                <Table.TableHeader>
                  <Table.TableRow>
                    <Table.TableHead className="text-center">
                      Cons
                    </Table.TableHead>
                  </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                  {json.cons?.map((pro) => (
                    <Table.TableRow key={pro}>
                      <Table.TableCell>{pro}</Table.TableCell>
                    </Table.TableRow>
                  ))}
                </Table.TableBody>
              </Table.Table>

              <Table.Table>
                <Table.TableHeader>
                  <Table.TableRow>
                    <Table.TableHead className="text-center">
                      Competitors
                    </Table.TableHead>
                  </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                  {json.competitors?.map((competitor) => (
                    <Table.TableRow key={competitor.location}>
                      <Table.TableCell>
                        {competitor.location} - {competitor.distance} meters
                        away
                      </Table.TableCell>
                    </Table.TableRow>
                  ))}
                </Table.TableBody>
              </Table.Table>
            </div>
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              Try Another Idea
            </Button>
          </div>
        )}

        <Dialog.Dialog open={promptDialog} onOpenChange={setPromptDialog}>
          {!json && (
            <Dialog.DialogTrigger asChild>
              <Button>Tell Us Your Idea</Button>
            </Dialog.DialogTrigger>
          )}
          <Dialog.DialogContent className="sm:max-w-[425px]">
            <Dialog.DialogHeader>
              <Dialog.DialogTitle>Tell Us Your Idea</Dialog.DialogTitle>
              <Dialog.DialogDescription>
                Describe your idea for a company, so we can tell you some
                statistics about it.
              </Dialog.DialogDescription>
            </Dialog.DialogHeader>

            <Form.Form {...form}>
              <form
                onSubmit={form.handleSubmit(onPrompt)}
                className="space-y-8"
              >
                <Form.FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Your Idea</Form.FormLabel>
                      <Form.FormControl>
                        <Textarea
                          className="min-h-[20vh]"
                          placeholder="My Company is going to be ..."
                          {...field}
                        />
                      </Form.FormControl>
                      <Form.FormDescription>
                        Tell us about the type of company you want to start.
                        Where do you want to start it? What do you want to sell?
                      </Form.FormDescription>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />

                <Dialog.DialogFooter>
                  <Button type="submit" className="w-full">
                    {promptLoading ? "Loading..." : "Submit"}
                  </Button>
                </Dialog.DialogFooter>
              </form>
            </Form.Form>
          </Dialog.DialogContent>
        </Dialog.Dialog>
      </div>

      <Dialog.Dialog open={locationDialog} onOpenChange={setLocationDialog}>
        <Dialog.DialogContent className="sm:max-w-[425px]">
          <Dialog.DialogHeader>
            <Dialog.DialogTitle>
              {locationErrorMessage ? "Error found" : "We Need Your Permission"}
            </Dialog.DialogTitle>
            <Dialog.DialogDescription>
              {locationErrorMessage ||
                "In order to use this app you need to enable geolocation"}
            </Dialog.DialogDescription>
          </Dialog.DialogHeader>
          <Dialog.DialogFooter>
            <Button onClick={() => onLocation()} className="w-full">
              {locationLoading
                ? "Loading..."
                : locationErrorMessage
                  ? "Use Default Location"
                  : "Enable Location"}
            </Button>
          </Dialog.DialogFooter>
        </Dialog.DialogContent>
      </Dialog.Dialog>
    </>
  );
}
