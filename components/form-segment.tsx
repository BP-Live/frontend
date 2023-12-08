"use client";

import { Dispatch, SetStateAction } from "react";

export function FormSegment({
  setSubmitted,
}: {
  setSubmitted: Dispatch<SetStateAction<boolean>>;
}) {
  return <button onClick={() => setSubmitted(true)}>Submit Segment</button>;
}
