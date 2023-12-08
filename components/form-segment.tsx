"use client";

import { Dispatch, SetStateAction } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { sendPromptAPI } from "@/app/api";
import { RestaurantJson } from "@/lib/types";

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

export function FormSegment({
  setSubmitted,
  setJson,
}: {
  setSubmitted: Dispatch<SetStateAction<boolean>>;
  setJson: Dispatch<SetStateAction<RestaurantJson | null>>;
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitted(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          await sendPromptAPI(longitude, latitude, values.prompt);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast({
                title: "Permission Error",
                description: "User denied the request for geolocation.",
              });
              break;
            case error.POSITION_UNAVAILABLE:
              toast({
                title: "Position Unavailable",
                description: "Location information is unavailable.",
              });
              break;
            case error.TIMEOUT:
              toast({
                title: "Timeout Error",
                description: "The request to get user location timed out.",
              });
              break;
            default:
              toast({
                title: "Unknown Error",
                description: "An unknown error occurred.",
              });
              break;
          }
        },
      );
    } else {
      toast({
        title: "Error with browser",
        description: "Geolocation is not supported by your browser.",
      });
    }

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WS}/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setJson((json) => ({ ...json, ...data }));
    };
  };

  return (
    <div className="flex items-center justify-center flex-col w-full min-h-[100vh]">
      <div className="p-3 lg:p-6 px-3 lg:px-10 flex items-center justify-center flex-col rounded-lg">
        <h1 className="text-2xl lg:text-4xl mb-16 text-center text-white font-bold">
          Describe your property needs
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 w-[20rem] md:w-[30rem]"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your demand..."
                      className="min-h-[40vh] text-primary bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-center items-center">
              <Button type="submit" className="w-full">
                Submit your request
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
