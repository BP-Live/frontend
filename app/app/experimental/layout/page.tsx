"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DetailsSegment } from "@/components/details-segment";
import { FormSegment } from "@/components/form-segment";
import { MapSegment } from "@/components/map-segment";

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

      <div className="w-full fixed top-0 left-0 bottom-[25vh] grid place-items-center -z-10">
        <MapSegment />
      </div>

      <div>
        <div className="h-[75vh]" />
        <div className="text-center min-h-[25vh]">
          <DetailsSegment />
        </div>
      </div>
    </div>
  );
}
