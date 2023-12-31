"use client";

import { Progress } from "@/components/ui/progress";
import { RestaurantJson } from "@/lib/types";

export function DetailsSegment({ json }: { json: RestaurantJson | null }) {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h1 className="text-4xl font-bold my-3 text-center text-white">
        Config panel
      </h1>
      <div className="flex flex-col w-[10/12] lg:w-3/4 justify-center items-center gap-4 mt-7">
        <div className="flex flex-row w-full justify-center items-center gap-3 p-2">
          <p className="text-xl font-bold text-center text-white -mt-1">
            Status
          </p>
          <Progress value={json?.progress || 0} className="w-1/2" />
        </div>
        <div className="flex flex-row w-full justify-center items-center gap-3 border-2 border-white rounded-xl p-2">
          <p className="text-xl font-bold text-center text-white">
            Business type:
          </p>
          <p className="text-lg text-center text-white">
            {json?.metadata?.type}
          </p>
        </div>
        <div className="flex flex-row w-full justify-center items-center gap-3 border-2 border-white rounded-xl p-2">
          <h2 className="text-xl font-bold text-center text-white">
            Business location:
          </h2>
          <h3 className="text-lg text-center text-white">
            {JSON.stringify(json?.metadata?.location || {})}
          </h3>
        </div>
      </div>
    </div>
  );
}
