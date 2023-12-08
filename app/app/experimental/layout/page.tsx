"use client";

import { DetailsSegment } from "@/components/details-segment";
import { FormSegment } from "@/components/form-segment";
import { MapSegment } from "@/components/map-segment";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LayoutPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      className={cn("h-full", {
        "overflow-hidden": !submitted,
        "overflow-auto": submitted,
      })}
    >
      <div
        className={cn(
          "absolute left-0 right-0 grid place-items-center transition-all duration-1000 z-10 bg-background text-foreground",
          { "top-0 bottom-0": !submitted, "-top-full bottom-full": submitted },
        )}
      >
        <FormSegment setSubmitted={setSubmitted} />
      </div>

      <div className="fixed top-0 left-0 right-0 lg:right-1/2 bottom-[25vh] lg:bottom-0 grid place-items-center -z-10">
        <MapSegment />
      </div>

      <div className="ml-0 lg:ml-[50%] h-full">
        <div className="h-[75vh] lg:h-0" />
        <div className="min-h-[25vh] lg:text-left lg:min-h-full p-6">
          <DetailsSegment />
        </div>
      </div>
    </div>
  );
}
