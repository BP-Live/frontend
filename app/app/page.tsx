"use client";

import { DetailsSegment } from "@/components/details-segment";
import { FormSegment } from "@/components/form-segment";
import { MapSegment } from "@/components/map-segment";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { RestaurantJson } from "@/lib/types";

export default function AppPage() {
  const [submitted, setSubmitted] = useState(false);
  const [json, setJson] = useState<RestaurantJson | null>(null);

  return (
    <div
      className={cn("h-full", {
        "overflow-hidden": !submitted,
        "overflow-auto": submitted,
      })}
    >
      <div
        className={cn(
          "absolute left-0 right-0 grid place-items-center transition-all duration-1000 z-20 bg-gradient-to-tl from-bkkPurple to-bkkPink text-foreground",
          { "top-0 bottom-0": !submitted, "-top-full bottom-full": submitted },
        )}
      >
        <FormSegment setSubmitted={setSubmitted} setJson={setJson} />
      </div>

      <div className="fixed top-0 left-0 right-0 lg:right-1/2 bottom-[25vh] lg:bottom-0 grid place-items-center">
        <MapSegment />
      </div>

      {submitted && (
        <div className="absolute top-0 left-0 lg:left-1/2 right-0 bottom-0 z-10 pointer-events-none">
          <div className="h-[75vh] lg:h-0 pointer-events-none" />
          <div className="min-h-[25vh] pointer-events-none lg:text-left lg:min-h-full p-3 bg-gradient-to-tl from-bkkPurple to-bkkPink">
            <Header submitted={submitted} />
            <DetailsSegment json={json} />
          </div>
        </div>
      )}
    </div>
  );
}
