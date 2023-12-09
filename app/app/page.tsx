"use client";

import { DetailsSegment } from "@/components/details-segment";
import { MapSegment } from "@/components/map-segment";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { RestaurantJson } from "@/lib/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Textarea } from "@/components/ui/textarea";
import { set } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { ToggleThemeButton } from "@/components/toggle-theme-button";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const promptSchema = z.object({
  prompt: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function AppPage() {
  const [[latitude, longitude], setLocation] = useState([47.497913, 19.040236]);

  const [requestLocationDialog, setRequestLocationDialog] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDialog, setLocationDialog] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const [promptDialog, setPromptDialog] = useState(false);

  const [json, setJson] = useState<RestaurantJson | null>(null);

  useEffect(() => {
    setLocationDialog(true);

    setLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.longitude, position.coords.latitude]);

          setLocationLoading(false);
          setLocationDialog(false);
          setPromptDialog(true);
        },
        (error) => {
          setLocationErrorMessage(error.message);
          setLocationLoading(false);
          setLocationDialog(true);
          setPromptDialog(false);
        },
      );
    } else {
      setLocationErrorMessage("Geolocation is not supported by this browser.");
      setPromptDialog(false);
      setLocationDialog(true);
    }
  }, []);

  useEffect(() => {
    if (!locationDialog) return;

    setRequestLocationDialog(true);
  }, [locationDialog]);

  useEffect(() => {
    if (locationDialog || !requestLocationDialog) return;

    setLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocation([position.coords.longitude, position.coords.latitude]);

          setLocationLoading(false);
          setPromptDialog(true);
        },
        () => {
          setLocationLoading(false);
          setPromptDialog(true);
        },
      );
    } else {
      setLocationErrorMessage("Geolocation is not supported by this browser.");
      setPromptDialog(false);
      setLocationDialog(true);
    }
  }, [locationDialog, requestLocationDialog]);

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

      setJson((json) => ({ ...json, ...data }));
    };

    setPromptLoading(false);
    setPromptDialog(false);
  }

  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { setTheme } = useTheme();

  return (
    <>
      <div className="fixed top-0 left-0 bottom-0 right-1/2">
        <MapSegment />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <span className="sr-only">Toggle theme</span>
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="absolute top-0 left-1/2 bottom-0 right-0 p-6 flex flex-col justify-center">
        {json && (
          <div className="h-full flex flex-col justify-between">
            <Progress value={json.progress || 0} />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center" colSpan={2}>
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{json.metadata?.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{json.metadata?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>
                    {JSON.stringify(json.metadata?.location || {})}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Pros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {json.pros?.map((pro) => (
                  <TableRow key={pro}>
                    <TableCell>{pro}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Cons</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {json.cons?.map((pro) => (
                  <TableRow key={pro}>
                    <TableCell>{pro}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={promptDialog} onOpenChange={setPromptDialog}>
          {!json && (
            <DialogTrigger asChild>
              <Button variant="outline">Tell Us Your Idea</Button>
            </DialogTrigger>
          )}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tell Us Your Idea</DialogTitle>
              <DialogDescription>
                Describe your idea for a company, so we can tell you some
                statistics about it.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onPrompt)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Idea</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[20vh]"
                          placeholder="My Company is going to be ..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tell us about the type of company you want to start.
                        Where do you want to start it? What do you want to sell?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" className="w-full">
                    {promptLoading ? "Loading..." : "Submit"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={locationDialog} onOpenChange={setLocationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {locationErrorMessage ? "Error found" : "We Need Your Permission"}
            </DialogTitle>
            <DialogDescription>
              {locationErrorMessage ??
                "In order to use this app you need to enable geolocation"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setLocationDialog(false)} className="w-full">
              {locationLoading
                ? "Loading..."
                : locationErrorMessage
                  ? "Use Default Location"
                  : "Enable Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
