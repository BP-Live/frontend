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
import { Textarea } from "@/components/ui/textarea";
import { set } from "date-fns";

const promptSchema = z.object({
  prompt: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function AppPage() {
  const [[latitude, longitude], setLocation] = useState([47.497913, 19.040236]);

  const [requestNewDialog, setRequestNewDialog] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDialog, setLocationDialog] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptDialog, setPromptDialog] = useState(false);

  const [json, setJson] = useState<RestaurantJson | null>(null);

  // TODO: Disable Location Dialog if the user has already given permission

  useEffect(() => {
    setLocationDialog(true);
  }, []);

  useEffect(() => {
    if (!locationDialog) return;

    setRequestNewDialog(true);
  }, [locationDialog]);

  useEffect(() => {
    if (locationDialog || !requestNewDialog) return;

    setLocationLoading(true);

    if (!("geolocation" in navigator)) {
      // Your browser does not support the HTML5 Geolocation API, so this demo will not work.
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocation([position.coords.longitude, position.coords.latitude]);

        console.log([position.coords.longitude, position.coords.latitude]);

        setLocationLoading(true);
        setPromptDialog(true);
      },
      () => {
        setLocationLoading(true);
        setPromptDialog(true);
      },
    );
  }, [locationDialog, requestNewDialog]);

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

  return (
    <>
      <MapSegment />
      <Dialog open={promptDialog} onOpenChange={setPromptDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tell Us Your Idea</DialogTitle>
            <DialogDescription>
              Describe your idea for a company, so we can tell you some
              statistics about it.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onPrompt)} className="space-y-8">
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
                      Tell us about the type of company you want to start. Where
                      do you want to start it? What do you want to sell?
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

      <Dialog open={locationDialog} onOpenChange={setLocationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>We Need Your Permission</DialogTitle>
            <DialogDescription>
              In order to use this app, you need to enable location.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setLocationDialog(false)} className="w-full">
              {locationLoading ? "Loading..." : "Enable Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// return (
// <div
//   className={cn("h-full", {
//     "overflow-hidden": !submitted,
//     "overflow-auto": submitted,
//   })}
// >
//   <div
//     className={cn(
//       "absolute left-0 right-0 grid place-items-center transition-all duration-1000 z-20 bg-gradient-to-tl from-bkkPurple to-bkkPink text-foreground",
//       { "top-0 bottom-0": !submitted, "-top-full bottom-full": submitted }
//     )}
//   >
//     {/* <FormSegment setSubmitted={setSubmitted} setJson={setJson} /> */}

// <Dialog open={open} onOpenChange={setOpen}>
//   <DialogTrigger asChild>
//     <Button variant="outline">Edit Profile</Button>
//   </DialogTrigger>
//   <DialogContent className="sm:max-w-[425px]">
//     <DialogHeader>
//       <DialogTitle>Tell Us Your Idea</DialogTitle>
//       <DialogDescription>
//         Describe your idea for a company, so we can tell you some
//         statistics about it.
//       </DialogDescription>
//     </DialogHeader>

//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-8"
//       >
//         <FormField
//           control={form.control}
//           name="prompt"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Your Idea</FormLabel>
//               <FormControl>
//                 <Textarea
//                   className="min-h-[20vh]"
//                   placeholder="My Company is going to be ..."
//                   {...field}
//                 />
//               </FormControl>
//               <FormDescription>
//                 Tell us about the type of company you want to start.
//                 Where do you want to start it? What do you want to sell?
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <DialogFooter>
//           <Button type="submit" className="w-full">
//             Save changes
//           </Button>
//         </DialogFooter>
//       </form>
//     </Form>
//   </DialogContent>
// </Dialog>
//   </div>

//   <div className="fixed top-0 left-0 right-0 lg:right-1/2 bottom-[25vh] lg:bottom-0 grid place-items-center">
//     <MapSegment />
//   </div>

//   {submitted ? (
//     <div className="absolute top-0 left-0 lg:left-1/2 right-0 bottom-0 z-10 pointer-events-none">
//       <div className="h-[75vh] lg:h-0" />
//       <div className="min-h-[25vh] lg:text-left lg:min-h-full p-3 bg-gradient-to-tl from-bkkPurple to-bkkPink">
//         <Header submitted={submitted} />
//         <DetailsSegment json={json} />
//       </div>
//     </div>
//   ) : (
//     <Header submitted={submitted} />
//   )}
// </div>
// );
