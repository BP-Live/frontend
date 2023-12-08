"use client";

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
  prompt: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function AppPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex items-center justify-center flex-col w-full min-h-[100vh]">
      <div className="flex flex-col items-center justify-center">
        <div className="p-3 lg:p-6 px-3 lg:px-10 border-2 border-border flex items-center justify-center flex-col rounded-lg">
          <h1 className="text-xl lg:text-2xl font-caption mb-5 text-center">
            Describe your property needs
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="shadcn"
                        className="min-h-[40vh]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-center items-center">
                <Button type="submit" size={"lg"}>
                  Submit your request
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
