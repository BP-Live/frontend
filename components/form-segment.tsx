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

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

export function FormSegment({
  setSubmitted,
}: {
  setSubmitted: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setSubmitted(true);
  }

  return (
    <div className="flex items-center justify-center flex-col w-full min-h-[100vh]">
      <div className="p-3 lg:p-6 px-3 lg:px-10 flex items-center justify-center flex-col rounded-lg">
        <h1 className="text-2xl lg:text-4xl mb-16 text-center text-white font-bold">
          Describe your property needs
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
