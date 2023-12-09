"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import * as Dropdown from "@/components/ui/dropdown-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapSegment } from "@/components/map-segment";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import * as Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as Table from "@/components/ui/table";
import * as Form from "@/components/ui/form";
import { RestaurantJson } from "@/lib/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import * as z from "zod";
import LogoutButton from "@/components/logout-button";
import { getLocation, saveLocation } from "@/lib/utils/storage";
import { Buda } from "next/font/google";

const promptSchema = z.object({
  prompt: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const BUDAPEST = [47.497913, 19.040236];

export default function AppPage() {
  const { setTheme } = useTheme();
  const [[latitude, longitude], setLocation] = useState(BUDAPEST);

  const [requestLocationDialog, setRequestLocationDialog] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDialog, setLocationDialog] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const [promptDialog, setPromptDialog] = useState(false);

  const [json, setJson] = useState<RestaurantJson | null>(null);

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
      setRequestLocationDialog(true);
      setLocationDialog(false);
      setPromptDialog(true);
    }

    if (requestLocationDialog || locationDialog || location) return;

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
      setRequestLocationDialog(true);
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
          setRequestLocationDialog(true);
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

  return (
    <>
      <div className="fixed top-0 left-0 bottom-1/2 lg:bottom-0 right-0 md:right-1/2">
        <MapSegment json={json} />
      </div>

      <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
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
        <LogoutButton />
      </div>

      <div className="absolute top-1/2 lg:top-0 left-0 lg:left-1/2 bottom-0 right-0 p-6 flex flex-col justify-center">
        {json && (
          <div className="h-full flex flex-col justify-between">
            <div className="w-full flex items-center gap-2 ">
              <Progress value={json.progress || 0} />
              <p className="font-bold text-primary whitespace-nowrap">
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
                    {JSON.stringify(json.metadata?.location || {})}
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
                      {competitor.location} - {competitor.distance} meters away
                    </Table.TableCell>
                  </Table.TableRow>
                ))}
              </Table.TableBody>
            </Table.Table>
          </div>
        )}

        <Dialog.Dialog open={promptDialog} onOpenChange={setPromptDialog}>
          {!json && (
            <Dialog.DialogTrigger asChild>
              <Button variant="outline">Tell Us Your Idea</Button>
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
